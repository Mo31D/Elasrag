"""Make the V2 road adapter. Split at exact 500 m tile boundaries without snapping."""
import json
import math
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SIZE = 500


def tile(point):
    return '_'.join(str(math.floor(v/SIZE)) for v in point)


def split(points):
    parts = []
    for a,b in zip(points,points[1:]):
        if a == b:
            continue
        cuts = {0.,1.}
        for low,high in zip(a,b):
            if low == high:
                continue
            for i in range(math.floor(min(low,high)/SIZE)+1, math.ceil(max(low,high)/SIZE)):
                cuts.add((i*SIZE-low)/(high-low))
        def point(t):
            return tuple(round(x+t*(y-x),6) for x,y in zip(a,b))
        ts = sorted(cuts)
        for start,end in zip(ts,ts[1:]):
            key = tile(point((start+end)/2))
            pair = [point(start),point(end)]
            if parts and parts[-1][0] == key:
                parts[-1][1].append(pair[1])
            else:
                parts.append((key,pair))
    for i,(key,part) in enumerate(parts):
        before = parts[i-1][1][-2] if i else None
        after = parts[i+1][1][1] if i+1<len(parts) else None
        yield key,part,before,after


def main():
    world_dir = ROOT/'public/world-core'
    core = json.loads((world_dir/'ambleside-v2.json').read_text())
    chunks = ROOT/'public/regions/windermere/chunks'
    existing = {r['id']:r for f in chunks.glob('*.json') for r in json.loads(f.read_text())['roads']}
    (e,ex,ez),(n,nx,nz) = core['legacyToBng']
    det = ex*nz-ez*nx
    tagged = defaultdict(list)
    replaced = []
    new = sorted(int(id.rsplit(':',1)[1]) for id in core['layers']['roads'])
    added = 0
    for ident in new:
        way = core['ways'][f'osm:way:{ident}']
        tags = way['tags']
        if tags.get('tunnel') not in (None,'no') or tags.get('indoor') == 'yes':
            continue
        pts = []
        for node in way['nodeIds']:
            east,north = core['nodes'][str(node)]
            de,dn = east-e,north-n
            pts.append((round((de*nz-dn*ez)/det,6),round((dn*ex-de*nx)/det,6)))
        if len(pts)<2:
            continue
        if ident not in existing:
            # For previously omitted ways, avoid importing clipped perimeter extensions.
            if not all(-935 < x < 860 and -2160 < z < 50 for x,z in pts):
                continue
            highway = tags['highway'].removesuffix('_link')
            kind = ('primary' if highway in ('trunk','primary') else 'secondary' if highway in ('secondary','tertiary')
                    else 'footpath' if highway in ('footway','pedestrian','path','steps','track','cycleway','bridleway')
                    else 'lane')
            record = {'id':ident,'kind':kind}
            for key in ('ref','name','surface','access'):
                if key in tags:
                    record[key] = tags[key]
            if tags.get('footway')=='sidewalk':
                record['sidewalk'] = True
            if tags.get('bridge') not in (None,'no'):
                record['bridge'] = True
            added += 1
        else:
            record = {k:v for k,v in existing[ident].items() if k!='pts'}
        replaced.append(ident)
        if record.get('bridge'):
            tagged[tile(pts[len(pts)//2])].append({**record,'pts':pts})
            continue
        for key,part,before,after in split(pts):
            entry = {**record,'pts':part}
            if before:
                entry['beforeTile'] = before
            if after:
                entry['afterTile'] = after
            tagged[key].append(entry)
    output = {'schemaVersion':2,'replaces':replaced,'tiles':tagged,'addedWayCount':added}
    (world_dir/'road-tiles-v2.json').write_text(json.dumps(output,separators=(',',':'))+'\n')
    print(f'{len(replaced)} compatible ways, {added} without a legacy record, {len(tagged)} tiles')


if __name__ == '__main__':
    main()
