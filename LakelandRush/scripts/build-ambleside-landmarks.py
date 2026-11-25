"""Run with blender -b -t 2 --python scripts/build-ambleside-landmarks.py."""
import json
import math
import sys
from pathlib import Path

import bpy

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from waterhead_mesh import Elevation, Mesh

REGION = ROOT / "public/regions/windermere"


def footprint(chunk, osm_id):
    buildings = json.loads((REGION / f"chunks/{chunk}.json").read_text())["buildings"]
    return next(b["pts"] for b in buildings if b["id"] == osm_id)


def palette(mesh):
    return (
        mesh.material("Lakeland rubble slate", (.22, .20, .18), .89),
        mesh.material("Lakeland roof slate", (.09, .11, .12), .87),
        mesh.material("Painted joinery", (.048, .085, .073), .44),
        mesh.material("Glazing", (.072, .108, .118), .26, .27),
        mesh.material("Sign lettering", (.80, .74, .56), .62),
    )


def lancaster_house():
    mesh = Mesh()
    stone, slate, trim, glass, lettering = palette(mesh)
    ring = footprint("0_-3", 423598927)
    eave = 5.85
    for i, start in enumerate(ring):
        edge = Elevation(mesh, start, ring[(i + 1) % len(ring)], -1)
        width = edge.width
        windows = []
        for j in range(max(0, int(width / 2.75))):
            center = (j + .5) * width / int(width / 2.75)
            windows.append((center - .48, center + .48, 3.55, 4.86))
        if i == 7:
            # Shop shares a longer frontage. Opening positions are provisional.
            windows += [(1, 3.5, .57, 2.31), (3.75, 4.85, -.04, 2.31), (5.1, 7.1, .57, 2.31)]
        edge.apertures(-1.0, eave, stone, windows, trim, glass)
        edge.block(0, width, eave - .1, eave + .04, -.10, .10, slate)
        if i == 7:
            edge.block(.86, 7.26, 2.37, 2.96, -.18, .025, trim)
            edge.lettering("THE BLACK SHEEP SHOP", 4.06, 2.54, 5.88, .29, -.188, lettering)
            edge.block(1, 7.1, -.07, .03, -.38, .10, stone)
        # A low hipped ring allows the surveyed outline to remain visible.
        a, b = ring[i], ring[(i + 1) % len(ring)]
        inset = lambda p: (p[0] * .74, p[1] * .84)
        ia, ib = inset(a), inset(b)
        mesh.face([(*a, eave), (*b, eave), (*ib, 7.22), (*ia, 7.22)], slate)
    mesh.cap([(x * .74, z * .84) for x, z in ring], 7.22, slate)
    mesh.export("Lancaster House and Black Sheep Shop", REGION / "assets/black-sheep-shop.glb")


def bridge_house():
    mesh = Mesh()
    stone, slate, _, glass, _ = palette(mesh)
    trim = mesh.material("White window joinery", (.68, .66, .58), .55)
    ring = footprint("0_-4", 389884072)
    a, b = ring[0], ring[1]
    main = Elevation(mesh, a, b, -1)
    w = main.width
    depth = 2.72
    eave = 4.43
    main.apertures(.0, eave, stone, [(1.61, 2.27, .63, 1.58), (2.67, 3.3, 2.72, 3.68)], trim, glass)
    rear = [main.point(u, depth, 0)[:2] for u in (0, w)]
    Elevation(mesh, rear[1], rear[0], -1).apertures(0, eave, stone, [(.82, 1.45, 2.73, 3.62)], trim, glass)
    Elevation(mesh, rear[0], a, -1).apertures(0, eave, stone, [(.52, 1.29, 2.17, 3.69)], trim, glass)
    Elevation(mesh, b, rear[1], -1).apertures(0, eave, stone, [(1.03, 1.58, 2.72, 3.61)], trim, glass)
    roof_axis = Elevation(mesh, rear[0], a, -1)
    roof_axis.gabled(0, depth, 0, w, eave, 5.66, stone, slate, slate)
    main.block(3.23, 3.85, 4.85, 6.16, 1.02, 1.57, stone)
    main.block(3.17, 3.91, 6.13, 6.26, .96, 1.63, slate)
    # Both parapet faces and the barrel soffit follow the same stone arch.
    arch = [(w / 2 + 1.66 * math.cos(math.pi * i / 14),
             -2.09 + 1.34 * math.sin(math.pi * i / 14)) for i in range(15)]
    for (u0, h0), (u1, h1) in zip(arch, arch[1:]):
        for d in (0, depth):
            main.surface([(u0, d, h0), (u1, d, h1), (u1, d, .18), (u0, d, .18)], stone)
        main.surface([(u0, 0, h0), (u1, 0, h1), (u1, depth, h1), (u0, depth, h0)], stone)
    main.block(0, arch[-1][0], -2.48, .18, 0, depth, stone)
    main.block(arch[0][0], w, -2.48, .18, 0, depth, stone)
    for i in range(9):
        main.block(-1.08, 0, -.22 + i * .245, .04 + i * .245, -.16 + i * .27, .15 + i * .27, stone)
    mesh.export("Bridge House", REGION / "assets/bridge-house.glb")


def filling_station():
    mesh = Mesh()
    fascia = mesh.material("Muted enamel", (.18, .31, .24), .57)
    roofing = mesh.material("Canopy roofing", (.22, .24, .24), .73)
    steel = mesh.material("Column finish", (.55, .55, .48), .45, .18)
    glazing = mesh.material("Pump display", (.075, .09, .08), .28)
    ring = footprint("0_-3", 658735202)
    for i, a in enumerate(ring):
        b = ring[(i + 1) % len(ring)]
        edge = Elevation(mesh, a, b, -1)
        edge.panel(0, edge.width, 3.7, 4.38, 0, fascia)
    mesh.cap(ring, 4.38, roofing)
    mesh.cap(ring[::-1], 3.7, steel)
    pumps = Elevation(mesh, (-2.5,-6.0), (-2.0,5.4))
    for u in (1.3, 6.4, 9.6):
        pumps.block(u-.12,u+.12,0,3.71,-.12,.12,steel)
        pumps.block(u-.57,u+.57,0,.14,-.54,.54,steel)
        pumps.block(u-.37,u+.37,.14,1.47,-.29,.29,fascia)
        pumps.panel(u-.22,u+.22,.96,1.34,-.30,glazing)
    mesh.export("Hill's filling station canopy", REGION / "assets/hills-canopy.glb")


def market_cross():
    mesh = Mesh()
    stone = mesh.material("Weathered sandstone", (.28, .26, .19), .95)
    cap = mesh.material("Weathered sandstone tops", (.34, .32, .24), .95)
    tiers = [(1.39, 0), (1.39, .14), (1.15, .16), (1.15, .37),
             (.79, .39), (.79, .58), (.45, .59), (.45, .81),
             (.24, .86), (.16, 2.56), (.22, 2.58), (.22, 2.85)]

    def ring(radius, y):
        return [(radius * math.cos(i * math.tau / 8), radius * math.sin(i * math.tau / 8), y)
                for i in range(8)]

    for lower, upper in zip(tiers, tiers[1:]):
        a, b = ring(*lower), ring(*upper)
        for i in range(8):
            j = (i + 1) % 8
            mesh.face([a[j], a[i], b[i], b[j]], stone if lower[0] == upper[0] else cap)
    mesh.cap([p[:2] for p in ring(*tiers[-1])], tiers[-1][1], cap)
    mesh.export("Ambleside Market Cross", REGION / "assets/market-cross.glb")


bpy.ops.object.select_all(action="DESELECT")
lancaster_house()
bpy.ops.object.select_all(action="DESELECT")
bridge_house()

bpy.ops.object.select_all(action="DESELECT")
market_cross()

bpy.ops.object.select_all(action="DESELECT")
filling_station()
