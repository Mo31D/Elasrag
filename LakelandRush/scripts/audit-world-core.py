"""Measure the legacy world against canonical OSM and the independent LiDAR source."""
import argparse
import json
import math
import sys
from collections import defaultdict
from importlib import import_module
from pathlib import Path
from osgeo import ogr

ROOT = Path(__file__).resolve().parents[1]
REGION = ROOT / 'public/regions/windermere'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--ostn15-dir', type=Path, required=True)
    args = parser.parse_args()
    world = json.loads((ROOT/'public/world-core/ambleside-v2.json').read_text())
    raster_transform = import_module('waterhead-lidar').british_grid_transform(args.ostn15_dir)
    roads, buildings, ownership = {}, {}, {}
    for file in (REGION/'chunks').glob('*.json'):
        chunk = json.loads(file.read_text())
        for road in chunk['roads']:
            roads[road['id']] = road['pts']
            ownership[road['id']] = file.stem
        for building in chunk['buildings']:
            buildings[building['id']] = [(building['cx']+x,building['cz']+z) for x,z in building['pts']]

    def bng(x,z):
        return tuple(sum(a*b for a,b in zip(line,(1,x,z))) for line in world['legacyToBng'])

    def coords(way):
        return [world['nodes'][str(n)] for n in world['ways'][way]['nodeIds']]

    def line(points,ring=False):
        geom = ogr.Geometry(ogr.wkbLinearRing if ring else ogr.wkbLineString)
        for x,y in points:
            geom.AddPoint_2D(x,y)
        if ring:
            geom.CloseRings()
            shape = ogr.Geometry(ogr.wkbPolygon)
            shape.AddGeometry(geom)
            return shape
        return geom

    matched_roads, missing, multis, deviations = [], [], [], []
    for way in world['layers']['roads']:
        ident = int(way.rsplit(':',1)[1])
        points = coords(way)
        if ident not in roads:
            missing.append(way)
            continue
        matched_roads.append(way)
        pts = roads[ident]
        if any(f'{math.floor(x/500)}_{math.floor(z/500)}' != ownership[ident] for x,z in pts):
            multis.append(way)
        legacy = line([bng(x,z) for x,z in pts])
        for e,n in points:
            sample = ogr.Geometry(ogr.wkbPoint)
            sample.AddPoint_2D(e,n)
            deviations.append(legacy.Distance(sample))
    overlaps = []
    for way in world['layers']['buildings']:
        ident = int(way.rsplit(':',1)[1])
        if ident not in buildings:
            continue
        source = line(coords(way),True)
        game = line([bng(x,z) for x,z in buildings[ident]],True)
        if not source.IsValid() or not game.IsValid():
            continue
        union = source.Union(game).GetArea()
        if union > 0:
            overlaps.append(source.Intersection(game).GetArea()/union)
    origin = raster_transform.TransformPoint(-2.9635,54.4175)[:2]
    nav = json.loads((ROOT/'src/data/ambleside-navigation.json').read_text())
    edges = defaultdict(set)
    for ident in world['layers']['roads']:
        way = world['ways'][ident]
        ids = way['nodeIds']
        for a,b in zip(ids,ids[1:]):
            edges[a].add(b)
            edges[b].add(a)
    connections = {route['id']: all(b in edges[a] for a,b in zip(route['nodeIds'],route['nodeIds'][1:]))
                   for route in nav['approaches']}
    results = {
        'snapshotBoundingBoxWgs84': world['bboxWgs84'],
        'matchedRoadWays':len(matched_roads),'referenceRoadWays':len(world['layers']['roads']),
        'canonicalRoadWaysWithoutLegacyMatch':len(missing),
        'wholeWaysCrossingTheirOwnerTile':len(multis),
        'sourceVertexOffsetsM':{'count':len(deviations),'p95':sorted(deviations)[int(.95*(len(deviations)-1))],
                                'max':max(deviations)},
        'matchedBuildingFootprintIoU':{'count':len(overlaps),'median':sorted(overlaps)[len(overlaps)//2],
                                       'atLeast99Percent':sum(x>=.99 for x in overlaps),'min':min(overlaps)},
        'terrainPipelineOriginDifferenceM':math.dist(origin,world['bngOrigin']),
        'independentSurveyControlAvailable':False,
        'routeConnections':connections,
    }
    out = ROOT/'references/world-core-v2-audit.json'
    out.write_text(json.dumps(results,indent=2)+'\n')
    print(out.read_text())
    if not all(connections.values()):
        sys.exit('A gameplay route has a non-canonical node pair')


if __name__ == '__main__':
    main()
