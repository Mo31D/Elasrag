"""Extract small public-realm feature set from a checked OpenStreetMap map response."""
import json
import math
import sys
from pathlib import Path

source = Path(sys.argv[1])
data = json.loads(source.read_text())["elements"]
nodes = {o["id"]: o for o in data if o["type"] == "node"}
ways = {o["id"]: o for o in data if o["type"] == "way"}
groups = {
    "parking": [171150701, 423828329, 698103903, 698103920],
    "shore": [698103913],
    "sidewalk": [121559793, 339185882, 1567958531, 1567958533, 1567958535, 1567958538,
                 1567958541, 1567958542, 1567958544, 1567958549],
    "railings": [1351170301],
}
precision = 111319.5


def point(o):
    return [round((o["lon"] + 2.9635)*precision*math.cos(math.radians(54.4175)), 2),
            round((54.4175 - o["lat"])*precision, 2)]


result = {key: [{"id": i, "points": [point(nodes[n]) for n in ways[i]["nodes"]]}
                for i in ids] for key, ids in groups.items()}
result["furniture"] = []
for o in nodes.values():
    x, z = point(o)
    t = o.get("tags", {})
    kind = "tree" if t.get("natural") == "tree" else t.get("amenity")
    if 37 < x < 145 and -415 < z < -225 and kind in ("tree", "bench", "waste_basket"):
        result["furniture"].append({"id": o["id"], "kind": kind, "point": [x,z]})
result["furniture"].sort(key=lambda o:o["id"])
target = Path(__file__).resolve().parents[1] / "src/data/waterhead-public-realm.json"
target.write_text(json.dumps(result, separators=(",", ":")) + "\n")
