#!/usr/bin/env python3
"""Refresh in-bounds Ambleside roads from an OSM map snapshot and audit the import."""
import argparse
from collections import defaultdict
import hashlib
import heapq
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGION = ROOT / "public/regions/windermere"
SW, NE = (-590, -2150), (590, 46)
CAR_ROADS = {"trunk", "primary", "secondary", "tertiary", "unclassified", "residential",
             "living_street", "service", "trunk_link", "primary_link", "secondary_link", "tertiary_link"}
PATHS = {"footway", "path", "pedestrian", "steps", "cycleway", "track", "bridleway"}
ROAD_SIZE = 500
SCALE = 111319.5


def point(node):
    return ((node["lon"] + 2.9635) * SCALE * math.cos(math.radians(54.4175)),
            (54.4175 - node["lat"]) * SCALE)


def in_zone(pt):
    return all(low <= val <= high for val, low, high in zip(pt, SW, NE))


def rounded(pt):
    return [round(c, 3) for c in pt]


def distance_to_segment(p, a, b):
    dx, dz = b[0] - a[0], b[1] - a[1]
    frac = ((p[0]-a[0])*dx + (p[1]-a[1])*dz) / (dx*dx + dz*dz or 1)
    t = max(0, min(1, frac))
    return math.hypot(p[0]-a[0]-t*dx, p[1]-a[1]-t*dz)


def road_kind(tags):
    highway = tags.get("highway")
    if tags.get("area") == "yes" or tags.get("indoor") == "yes":
        return None
    if highway in PATHS:
        return "footpath"
    if highway in {"trunk", "primary", "trunk_link", "primary_link"}:
        return "primary"
    if highway in {"secondary", "tertiary", "secondary_link", "tertiary_link"}:
        return "secondary"
    if highway in CAR_ROADS:
        return "lane"
    return None


def path(graph, start, end):
    queue = [(0, start)]
    costs, previous = {start: 0}, {}
    while queue:
        cost, u = heapq.heappop(queue)
        if cost != costs[u]:
            continue
        if u == end:
            result = [end]
            while result[-1] != start:
                result.append(previous[result[-1]])
            return result[::-1], cost
        for v, length in graph[u]:
            total = cost + length
            if total < costs.get(v, math.inf):
                costs[v], previous[v] = total, u
                heapq.heappush(queue, (total, v))
    raise ValueError(f"No connected route from OSM node {start} to {end}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("snapshot", type=Path)
    parser.add_argument("--baseline", type=Path, required=True, help="Unmodified region directory")
    parser.add_argument("--retrieved", required=True, help="Retrieval date in ISO format")
    args = parser.parse_args()
    raw = args.snapshot.read_bytes()
    elements = json.loads(raw)["elements"]
    nodes = {o["id"]: point(o) for o in elements if o["type"] == "node"}
    ways = {o["id"]: o for o in elements if o["type"] == "way"}
    chunks = {p.stem: json.loads(p.read_text()) for p in (args.baseline / "chunks").glob("*.json")}
    manifest = json.loads((args.baseline / "manifest.json").read_text())
    legacy = {r["id"]: r for c in chunks.values() for r in c["roads"]}
    grouped = defaultdict(list)
    road_map = {}
    degrees = defaultdict(set)
    pedestrian = defaultdict(list)
    graphs = {key: defaultdict(list) for key in ("east", "west", "old", "arcade")}
    road_names = {
        "east": {"Lake Road", "Kelsick Road"},
        "west": {"Borrans Road", "Rothay Road", "Kelsick Road"},
        "old": {"Old Lake Road"},
        "arcade": {"Lake Road", "Kelsick Road", "Compston Road", "Rydal Road", "Market Cross"},
    }
    for ident, way in sorted(ways.items()):
        tags = way.get("tags", {})
        kind = road_kind(tags)
        ids = way["nodes"]
        if not kind or len(ids) < 2 or any(n not in nodes for n in ids):
            continue
        pts = [nodes[n] for n in ids]
        if not any(map(in_zone, pts)) or tags.get("tunnel") == "building_passage":
            continue
        record = {"id": ident, "kind": kind, "pts": list(map(rounded, pts))}
        for key in ("name", "ref", "surface"):
            if key in tags:
                record[key] = tags[key]
        if tags.get("footway") == "sidewalk":
            record["sidewalk"] = True
        if tags.get("width", "").replace(".", "", 1).isdigit():
            record["widthM"] = float(tags["width"])
        if tags.get("bridge") not in (None, "no"):
            record["bridge"] = True
        if tags.get("oneway") in ("yes", "-1", "1") or tags.get("junction") == "roundabout":
            record["oneway"] = True
            record["direction"] = -1 if tags.get("oneway") == "-1" else 1
        if tags.get("access") in ("private", "no"):
            record["access"] = tags["access"]
        road_map[ident] = (pts, record)
        mx, mz = pts[len(pts)//2]
        grouped[f"{math.floor(mx/ROAD_SIZE)}_{math.floor(mz/ROAD_SIZE)}"].append(record)
        for u, v in zip(ids, ids[1:]):
            degrees[u].add(v)
            degrees[v].add(u)
            length = math.dist(nodes[u], nodes[v])
            if tags.get("foot") not in ("no", "private") and tags.get("access") not in ("private", "no"):
                pedestrian[u].append((v, length))
                pedestrian[v].append((u, length))
            if kind == "footpath" or tags.get("access") in ("private", "no"):
                continue
            for key, names in road_names.items():
                if key == "arcade" or tags.get("name") in names:
                    # These are pedestrian inspection routes. Vehicular direction is recorded separately.
                    graphs[key][u].append((v, length))
                    graphs[key][v].append((u, length))

    for key in sorted(set(chunks) | set(grouped)):
        cx,z = map(int,key.split("_"))
        c = chunks.setdefault(key, {"key":key,"cx":cx,"cz":z,"roads":[],"buildings":[],
                                     "piers":[],"walls":[],"woodlands":[]})
        c["roads"] = [r for r in c["roads"] if r["id"] not in road_map
                      and (r["kind"] in ("ferry","railway") or not all(map(in_zone,r["pts"])) or r["id"] in ways)]
        c["roads"].extend(grouped[key])

    comparisons = []
    for ident, (source_points, r) in road_map.items():
        if ident in legacy and len(legacy[ident]["pts"]) >= 2:
            old = legacy[ident]["pts"]
            old_offsets = [min(distance_to_segment(p,a,b) for a,b in zip(old,old[1:])) for p in source_points]
            comparisons.extend(old_offsets)
    new_offsets = [math.dist(p,q) for source, record in road_map.values() for p,q in zip(source,record["pts"])]
    routes = []
    ends = [("east", "A591 Lake Road", 232013, 232039),
            ("west", "A5075 Borrans Road → A593 Rothay Road",232013,232028),
            ("old","Old Lake Road",270334846,31555601)]
    for key, name, start, finish in ends:
        ids, length = path(graphs[key],start,finish)
        routes.append({"id":key,"name":name,"lengthM":round(length,1),"nodeIds":ids,
                       "points":[rounded(nodes[n]) for n in ids]})
    arcade_end = min(graphs["arcade"], key=lambda n:math.dist(nodes[n],(8,-1745)))
    lower, a = path(graphs["arcade"],5204494271,232039)
    upper, b = path(graphs["arcade"],232039,arcade_end)
    ids, length = lower + upper[1:], a+b
    # The named stop is the feature. The spawn is always a distinct measured path point.
    stops = [
        ("waterhead","Waterhead Pier","landmark",(75.1,-238.4),(89,-248),[423828335]),
        ("fork","Waterhead road split","junction",nodes[232013],nodes[232013],[232013]),
        ("lake-road","A591 Lake Road approach","junction",nodes[270334846],nodes[270334846],[537774261]),
        ("borrans","A5075 Borrans Road approach","junction",nodes[746858662],nodes[746858662],[580925658]),
        ("old-lake-road","Old Lake Road","junction",nodes[9386900625],nodes[9386900625],[31526951]),
        ("picnic","Lakeside Picnic","shop",nodes[4233922881],(70,-367),[4233922881,256765270]),
        ("black-sheep","The Black Sheep Shop","shop",nodes[4231695543],(71,-1400.4),[4231695543,423598927]),
        ("market","Market Cross","landmark",nodes[423190096],(73,-1641),[423190096]),
        ("bridge-house","Bridge House","landmark",(1.3,-1744.6),(9,-1744.1),[389884072]),
        ("rothay-bridge","Rothay Bridge","landmark",(-370,-1008),(-353,-1003),[1112805889]),
        ("rothay-park","Rothay Park","park",(-255,-1542),(-255,-1542),[16841911]),
        ("tesco","Tesco Express","food",nodes[2908529784],(69,-1561),[2908529784]),
        ("coop","Co-op Food","food",nodes[907909101],(-13,-1631),[907909101]),
        ("hills","Hill’s filling station","fuel",(89,-1210),(75,-1208),[658735201]),
        ("galava","Galava Roman Fort","attraction",(-337,-536),(-316,-533),[43060432]),
        ("car-park","Lake Road Car Park","parking",(41,-1333),(51,-1335),[262236077]),
    ]
    headings = {}
    for stop, route, node in (("lake-road",routes[0],270334846), ("borrans",routes[1],746858662),
                              ("old-lake-road",routes[2],9386900625)):
        headings[stop] = route["points"][route["nodeIds"].index(node)+1]
    # Face the mapped canopy from the approach on Lake Road.
    headings["hills"] = [85,-1208.7]
    shop_start = next(spawn for key,_,_,_,spawn,_ in stops if key == "picnic")
    shop_end = next(spawn for key,_,_,_,spawn,_ in stops if key == "black-sheep")
    # Join the walking network from the two playable shop approaches.
    baskets = sorted(pedestrian, key=lambda n: math.dist(nodes[n], shop_start))[:8]
    targets = sorted(pedestrian, key=lambda n: math.dist(nodes[n], shop_end))[:8]
    choices = []
    for start in baskets:
        for finish in targets:
            try:
                shop_nodes, metres = path(pedestrian,start,finish)
            except ValueError:
                continue
            access = math.dist(nodes[start],shop_start) + math.dist(nodes[finish],shop_end)
            # Prefer short entrance links over cutting across separate paths.
            choices.append((metres + 4 * access, metres + access, shop_nodes))
    _, shop_length, shop_nodes = min(choices)
    routes.append({"id":"shop-link", "name":"Lakeside Picnic → The Black Sheep Shop",
                   "lengthM":round(shop_length,1), "nodeIds":shop_nodes,
                   "points":[rounded(p) for p in [shop_start,*(nodes[n] for n in shop_nodes),shop_end]]})
    nav = {"approaches": routes, "arcade": [rounded(nodes[n]) for n in ids],
           "arcadeFinishNode": arcade_end, "arcadeLengthM": round(length,1),
           "stops":[{"id":i,"name":name,"kind":kind,"point":rounded(target),"spawn":rounded(spawn),
                     "osmIds":osm, "heading":headings.get(i)} for i,name,kind,target,spawn,osm in stops]}
    surfaces = defaultdict(list)
    # Leave the authored Waterhead parking and forecourts with the waterfront layer.
    for ident in (99513652, 121481163, 123600857, 169645715, 262236077, 658735201):
        way = ways[ident]
        points = [nodes[node] for node in way["nodes"][:-1]]
        x,z = (sum(p[axis] for p in points) / len(points) for axis in (0,1))
        chunk = f"{math.floor(x/ROAD_SIZE)}_{math.floor(z/ROAD_SIZE)}"
        surfaces[chunk].append({"id":ident, "name":way["tags"]["name"],
                                "points":[rounded(p) for p in points]})
    (ROOT/"src/data/ambleside-surfaces.json").write_text(json.dumps(surfaces,separators=(",",":"))+"\n")
    audit = {"retrieved":args.retrieved, "snapshotSha256":hashlib.sha256(raw).hexdigest(),
             "osm": "https://api.openstreetmap.org/api/0.6/map.json?bbox=-2.978,54.417,-2.950,54.437",
             "roadWays":len(road_map), "newWayIds":len(set(road_map)-set(legacy)),
             "sharedWayIds":len(set(road_map)&set(legacy)), "connectedJunctionNodes":sum(len(d)>2 for d in degrees.values()),
             "oldSampleCount":len(comparisons), "oldOffsetMeanM":round(sum(comparisons)/len(comparisons),3),
             "oldOffsetP95M":round(sorted(comparisons)[int(.95*(len(comparisons)-1))],3),
             "oldOffsetMaxM":round(max(comparisons),3), "newOffsetMaxM":round(max(new_offsets),5)}
    existing = set(manifest["availableChunks"])
    manifest["availableChunks"] += sorted(set(chunks)-existing)
    for key,c in chunks.items():
        old = args.baseline/"chunks"/f"{key}.json"
        if old.exists() and json.loads(old.read_text()) == c:
            continue
        (REGION/"chunks"/f"{key}.json").write_text(json.dumps(c,separators=(",",":"))+"\n")
    (REGION/"manifest.json").write_text(json.dumps(manifest,separators=(",",":"))+"\n")
    (ROOT/"src/data/ambleside-navigation.json").write_text(json.dumps(nav,separators=(",",":"))+"\n")
    (ROOT/"references/ambleside-road-audit.json").write_text(json.dumps(audit,indent=2)+"\n")
    print(json.dumps(audit, indent=2))
    print([(r["name"],r["lengthM"],len(r["nodeIds"])) for r in routes], "arcade:", length,arcade_end)


if __name__ == "__main__":
    main()
