#!/usr/bin/env python3
"""Build the engine-independent Ambleside package from an OSM API snapshot."""
import argparse
import hashlib
import json
import math
from collections import defaultdict
from pathlib import Path

from pyproj import Transformer
from pyproj.enums import TransformDirection

ROOT = Path(__file__).resolve().parents[1]
BOUNDS = [-2.978, 54.417, -2.950, 54.437]
ORIGIN = [-2.9635, 54.4175]
HIGHWAYS = {
    'trunk', 'primary', 'secondary', 'tertiary', 'unclassified', 'residential', 'living_street',
    'service', 'trunk_link', 'primary_link', 'secondary_link', 'tertiary_link', 'footway',
    'path', 'pedestrian', 'steps', 'cycleway', 'track', 'bridleway',
}
PILOTS = [
    ('lw:premises:ambleside:2-lancaster-house', 'lw:business:black-sheep-shop', 'The Black Sheep Shop',
     'osm:node:4231695543', 'osm:way:423598927', 'https://theblacksheepshop.co.uk/'),
    ('lw:premises:waterhead:lakeside-picnic', 'lw:business:lakeside-picnic', 'Lakeside Picnic',
     'osm:node:4233922881', 'osm:way:256765270', 'https://lakesidepicnic.co.uk/'),
]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('snapshot', type=Path)
    parser.add_argument('--ostn15', required=True, type=Path)
    parser.add_argument('--retrieved', required=True)
    args = parser.parse_args()
    if not args.ostn15.is_file():
        parser.error('An OSTN15 PROJ grid is required')
    transform = Transformer.from_pipeline(
        '+proj=pipeline +step +proj=unitconvert +xy_in=deg +xy_out=rad '
        f'+step +inv +proj=hgridshift +grids={args.ostn15.resolve()} '
        '+step +proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy')
    raw = args.snapshot.read_bytes()
    elements = json.loads(raw)['elements']
    nodes = {item['id']: item for item in elements if item['type'] == 'node'}
    coords = {ident: transform.transform(value['lon'], value['lat'], errcheck=True)
              for ident, value in nodes.items()}
    local_origin = transform.transform(*ORIGIN, errcheck=True)
    # Least-squares affine approximation for an offline inspector. Publish its measured residual.
    import numpy as np
    samples = [(lon, lat) for lon in np.linspace(BOUNDS[0], BOUNDS[2], 21)
               for lat in np.linspace(BOUNDS[1], BOUNDS[3], 21)]
    design = np.asarray([[1, (lon-ORIGIN[0])*111319.5*math.cos(math.radians(ORIGIN[1])),
                          (ORIGIN[1]-lat)*111319.5] for lon,lat in samples])
    metrics = np.asarray([transform.transform(lon,lat) for lon,lat in samples])
    fit = np.linalg.lstsq(design,metrics,rcond=None)[0]
    residual = np.linalg.norm(design @ fit - metrics, axis=1)
    graphs = {}
    ways = {}
    layers = defaultdict(list)
    poi_keys = ('shop','amenity','tourism','historic','public_transport','leisure','entrance')
    for item in elements:
        ident = item['id']
        tags = item.get('tags', {})
        osm_id = f"osm:{item['type']}:{ident}"
        if item['type'] == 'node' and any(k in tags for k in poi_keys):
            layers['places'].append({'id':osm_id,'point':coords[ident],'tags':tags})
            continue
        if item['type'] != 'way' or any(n not in nodes for n in item['nodes']):
            continue
        ids = item['nodes']
        closed = len(ids) >= 4 and ids[0] == ids[-1]
        highway = tags.get('highway')
        kind = ('roads' if highway in HIGHWAYS and tags.get('area') != 'yes'
                else 'buildings' if closed and 'building' in tags
                else 'water' if 'waterway' in tags or tags.get('natural') == 'water'
                else 'rail' if 'railway' in tags
                else 'land' if closed and ('landuse' in tags or tags.get('natural') == 'wood')
                else 'places' if closed and any(k in tags for k in poi_keys)
                else None)
        if not kind:
            continue
        ways[osm_id] = {'nodeIds':ids,'tags':tags,'geometry':'Polygon' if closed and kind != 'roads' else 'LineString'}
        layers[kind].append(osm_id)
        if kind == 'roads':
            for a,b in zip(ids,ids[1:]):
                graphs.setdefault(a,set()).add(b)
                graphs.setdefault(b,set()).add(a)
    used = {n for w in ways.values() for n in w['nodeIds']}
    packed = {'schemaVersion':2,'region':'ambleside-waterhead','bboxWgs84':BOUNDS,
              'datums':{'horizontal':'EPSG:27700 via OSTN15; WGS84 treated as ETRS89 at mapping precision',
                        'vertical':'ODN; engine Y relative to 39 m ODN'},
              'bngOrigin':local_origin, 'legacyOrigin':ORIGIN,'legacyToBng':fit.T.tolist(),
              'sampledTransformResidualM':float(max(residual)),
              'source':{'name':'OpenStreetMap API','licence':'ODbL 1.0','attribution':'© OpenStreetMap contributors',
                        'url':'https://api.openstreetmap.org/api/0.6/map.json?bbox='+','.join(map(str,BOUNDS)),
                        'retrieved':args.retrieved,'sha256':hashlib.sha256(raw).hexdigest()},
              'nodes':{str(n):[round(v,3) for v in coords[n]] for n in sorted(used)},
              'ways':ways,'layers':dict(layers),
              'entities':[{'id':p,'kind':'premises','buildingRef':b,'locationRef':l,'verification':'mapped'}
                          for p,_,_,l,b,_ in PILOTS] +
                         [{'id':i,'kind':'business','premisesId':p,'name':name,'website':url,
                           'verification':'owner-identified pilot'} for p,i,name,_,_,url in PILOTS],
              'audit':{'roadWays':len(layers['roads']),'junctionNodes':sum(len(a)>2 for a in graphs.values()),
                       'buildingWays':len(layers['buildings']),
                       'pointFeatures':sum(isinstance(p,dict) for p in layers['places']),
                       'sourceRoundTripDegrees':max(math.dist(
                           transform.transform(*coords[n],direction=TransformDirection.INVERSE),
                           (nodes[n]['lon'],nodes[n]['lat'])) for n in used)}}
    out = ROOT/'public/world-core/ambleside-v2.json'
    out.write_text(json.dumps(packed,separators=(',',':'))+'\n')
    print(json.dumps(packed['audit'], indent=2))
    print('Sampled browser affine fit max residual (m)', max(residual))


if __name__ == '__main__':
    main()
