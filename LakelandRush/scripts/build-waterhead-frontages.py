"""Compile the two mapped frontages. Blender 4.3, no external Python packages."""
import json
import math
import sys
from pathlib import Path
import bpy

sys.path.insert(0, str(Path(__file__).resolve().parent))
from waterhead_mesh import Elevation, Mesh

ROOT = Path(__file__).resolve().parents[1]
REGION = ROOT / "public/regions/windermere"
BUILDINGS = {b["id"]: b for b in json.loads((REGION / "chunks/0_-1.json").read_text())["buildings"]}


def palette(mesh):
    return (
        mesh.material("Lakeland rubble slate", (.24,.23,.20), .84),
        mesh.material("Lakeland roof slate", (.16,.17,.18), .83),
        mesh.material("Painted ivory joinery", (.79,.78,.70), .56),
        mesh.material("Glazing", (.039,.066,.069), .245, .32),
        mesh.material("Painted forest green", (.025,.073,.051), .63),
        mesh.material("Sandstone lintels", (.36,.31,.24), .87),
        mesh.material("White roughcast", (.72,.72,.66), .96),
        mesh.material("Black ironwork", (.037,.041,.037), .51, .3),
        mesh.material("Muted brass sign", (.51,.37,.17), .73),
    )


def edge(mesh, pts, index):
    a = pts[index]
    b = pts[(index+1)%len(pts)]
    # Exterior wall normals depend on the source ring winding.
    area = sum(x * v - z * u for (x,z),(u,v) in zip(pts,pts[1:]+pts[:1]))
    return Elevation(mesh, a, b, 1 if area > 0 else -1)


def regular_windows(width, y, count, span, rise):
    return [(width*i/(count+1)-span/2, width*i/(count+1)+span/2, y, y+rise)
            for i in range(1,count+1)]


def inn():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    mesh = Mesh()
    stone, slate, ivory, glass, green, lintel, plaster, iron, brass = palette(mesh)
    pts = BUILDINGS[423874287]["pts"]
    main_front = 6
    wing_front = 8
    bay_start = 13.75
    bay_end = 17.35
    for i in range(len(pts)):
        wall = edge(mesh, pts, i)
        w = wall.width
        front = i == main_front
        eave = 7.0
        slots = []
        if front:
            slots = [(a,b,h,h+r) for a,b in ((1.2,2.38),(5.15,6.48),(8.65,10.02),(19.2,20.65))
                     for h,r in ((.9,2.05),(4.43,1.67))]
        elif i in (5,7,8,12,17,21,25,26):
            count = max(1, min(6, int(w/3.0)))
            slots = regular_windows(w, 1.16, count, min(1.1,w/(2*count+1)),1.64)
            slots += regular_windows(w,4.35,count,min(1.02,w/(2*count+1)),1.56)
        wall.apertures(-1.85, eave, stone, slots, ivory, glass)
        if front:
            for a,b,h0,h1 in slots:
                wall.block(a-.17,b+.17,h1+.01,h1+.22,-.10,.03,lintel)
    mesh.cap(pts, 7.0, slate)
    f = edge(mesh, pts, main_front)
    w = f.width
    # Slate ridge parallel to the street with two prominent projecting cross gables.
    lo, hi = -.18, w+.12
    if w > 0:
        f.surface([(lo,-.22,7.0),(hi,-.22,7.0),(hi,4.1,9.10),(lo,4.1,9.10)], slate)
        f.surface([(lo,4.1,9.10),(hi,4.1,9.10),(hi,8.4,7.0),(lo,8.4,7.0)], slate)
        for u in (lo,hi):
            f.surface([(u,-.22,7.0),(u,4.1,9.10),(u,8.4,7.0)],stone)
    f.gabled(3.7,11.3,-.35,4.0,7.02,9.75,stone,slate,ivory)
    f.gabled(13.05,18.3,-.24,4.4,7.05,9.42,stone,slate,ivory)
    f.block(13.4,17.7,6.48,6.62,-.96,.01,slate)
    # Tall projecting white bay with angled glazed cheeks.
    for h0,h1 in ((.45,3.16),(3.24,3.99),(4.10,6.45)):
        f.block(bay_start,bay_end,h0,h1,-.64,-.55,iron)
        f.frame(bay_start+.14,bay_end-.14,h0+.08,h1-.08,-.84,ivory,glass,3,h1-h0>1)
        for side in (bay_start,bay_end):
            f.surface([(side,-.81,h0),(side-.27 if side==bay_start else side+.27,0,h0),
                       (side-.27 if side==bay_start else side+.27,0,h1),(side,-.81,h1)],ivory)
    for h in (.39,3.15,3.98,6.46):
        f.block(bay_start-.09,bay_end+.09,h,h+.11,-.96,.02,ivory)
    # Veranda balcony and white glazed porch.
    f.block(3.1,11.7,3.63,3.86,-1.71,.03,ivory)
    for u in (3.25,5.9,8.86,11.52):
        f.block(u-.045,u+.045,.18,3.65,-1.66,-1.55,iron)
    f.block(3.2,11.64,4.57,4.65,-1.61,-1.54,iron)
    for i in range(34):
        u = 3.25+i*.25
        f.block(u,u+.022,3.85,4.58,-1.6,-1.57,iron)
    f.block(18.25,22.9,2.83,3.18,-1.7,0,ivory)
    for i in range(3):
        u = 18.30+i*1.50
        f.frame(u,u+1.48,.32,2.84,-1.62,ivory,glass,1)
    f.lettering("THE WATERHEAD INN", 20.54, 2.94, 3.84, .14, -1.708, iron)
    for j in range(4):
        f.block(17.75,22.85,-.24,.02+j*.105,-3.0+j*.34,-1.48,lintel)
    for u,d,h in ((1.9,4.5,10.5),(9.8,4.3,10.7),(15.9,2.1,11.22),(21.2,5.3,10.1)):
        f.block(u-.41,u+.41,8.5,h,d-.43,d+.43,stone)
        f.block(u-.50,u+.50,h,h+.16,d-.49,d+.49,lintel)
    wing = edge(mesh,pts,wing_front)
    wing.gabled(-.12,wing.width+.12,-.25,6.0,7.0,9.25,stone,slate,ivory)
    for i, length in ((2,8.4),(21,6.2)):
        back = edge(mesh,pts,i)
        back.gabled(0,back.width,0,length,7.0,8.7,stone,slate)
    mesh.export("The Waterhead Inn", REGION / "assets/waterhead-inn.glb")


def picnic():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    mesh = Mesh()
    stone, slate, ivory, glass, green, lintel, plaster, iron, brass = palette(mesh)
    pts = BUILDINGS[256765270]["pts"]
    f = edge(mesh,pts,0)
    w = f.width
    center = w*.5
    for i in (1,2,3):
        side = edge(mesh,pts,i)
        side.apertures(-.84,2.78,plaster,[],green,glass)
    f.apertures(-.84,2.78,plaster,[(center-.82,center+.82,.10,2.77)],green,glass)
    depth = edge(mesh,pts,1).width
    f.gabled(-.50,w+.50,-.16,depth,2.77,5.18,plaster,slate,green)
    # Cut-out gable glazing runs to the entrance threshold in a single green frame.
    f.surface([(center-.94,-.18,2.77),(center+.94,-.18,2.77),
               (center+.94,-.18,4.65),(center,-.18,5.06),
               (center-.94,-.18,4.65)], glass)
    for u in (center-.94,center,center+.94):
        f.block(u-.038,u+.038,2.76,5.03 if u==center else 4.72,-.23,-.16,green)
    for h in (2.74,3.35,4.40):
        f.block(center-.94,center+.94,h,h+.075,-.24,-.17,green)
    f.block(center-.97,center+.97,-.01,.11,-.82,0,stone)
    f.block(center-.72,center+.72,.13,.51,-.022,.075,green)
    f.block(center+.48,center+.53,.98,1.18,-.084,.075,brass)
    f.block(center+.35,center+.59,1.025,1.065,-.09,.03,brass)
    # Hand-built gold plaque, with no borrowed logo or raster art.
    plaque = [(2.05+math.cos(i*math.tau/32)*.50,-.11,2.12+math.sin(i*math.tau/32)*.52)
              for i in range(32)]
    f.surface(plaque,brass)
    f.lettering("LAKESIDE",2.05,2.13,.76,.14,-.117,iron)
    f.lettering("PICNIC",2.05,1.96,.64,.15,-.117,iron)
    # The benches and ice-cream counter furniture stay close to the documented facade.
    for left,right in ((.66,2.96),(5.71,7.98)):
        f.block(left,right,.42,.52,-.88,-.34,lintel)
        f.block(left,right,.69,.94,-.43,-.32,brass)
        for u in (left+.09,right-.13):
            f.block(u-.055,u+.055,.02,.48,-.82,-.72,iron)
    leaf = mesh.material("Geranium leaves",(.076,.155,.058),.94)
    flower = mesh.material("Muted flower petals",(.39,.09,.097),.88)
    for u,h in ((1.36,1.45),(3.19,1.38),(5.65,1.46),(7.69,1.45)):
        f.block(u-.25,u+.25,h-.23,h-.03,-.32,-.08,stone)
        for k in range(12):
            a = k * 2.399
            x = u + math.cos(a) * (.11 + .025 * (k % 4))
            y = h + math.sin(a) * (.07 + .011 * (k % 4))
            f.surface([(x-.095,-.36,y),(x,-.46,y+.115),(x+.10,-.35,y),(x,-.33,y-.085)],
                      flower if k % 4 == 0 else leaf)
    mesh.export("Lakeside Picnic", REGION / "assets/lakeside-picnic.glb")


def shore_shops():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    mesh = Mesh()
    stone, slate, ivory, glass, green, lintel, plaster, iron, brass = palette(mesh)
    fascia = mesh.material("Indigo painted fascia",(.034,.055,.11),.64)
    canvas = mesh.material("Waterhead blue awning",(.027,.14,.31),.89)
    pts = BUILDINGS[423828326]["pts"]
    f = edge(mesh, pts, 0)
    width = f.width
    depth = edge(mesh, pts, 1).width
    for i in (1,2,3):
        side = edge(mesh, pts, i)
        slots = regular_windows(side.width, .75, 2, 1.1, 1.55) if i == 1 else []
        side.apertures(-.86,3.8,plaster,slots,fascia,glass)
    f.apertures(-.86,3.8,plaster,[(.54,5.13,.34,2.74),(5.35,7.3,.11,2.74),
                                 (7.58,11.3,.72,2.74),(11.51,13.76,.11,2.74)],fascia,glass)
    f.gabled(-.18,7.34,-.28,depth,3.76,5.92,plaster,slate,fascia)
    f.gabled(7.37,width+.21,-.21,depth,3.76,5.25,plaster,slate,fascia)
    f.block(.34,7.27,2.78,3.51,-.13,-.02,fascia)
    f.block(7.43,13.92,2.79,3.46,-.13,-.02,fascia)
    f.lettering("SHELL SHOP",3.64,3.05,4.8,.27,-.142,ivory)
    f.lettering("AMBLESIDE FISH & CHIPS",10.60,3.03,6.0,.21,-.142,ivory)
    f.surface([(.43,-.13,2.96),(7.04,-.13,2.96),(7.04,-1.61,2.59),(.43,-1.61,2.59)],canvas)
    f.block(.43,7.04,2.47,2.59,-1.63,-1.59,canvas)
    f.block(.14,width,-.21,.10,-2.43,0,lintel)
    f.block(.14,width,-.82,-.21,-2.42,-2.22,stone)
    for i in range(8):
        u = 7.76+i*.82
        f.block(u-.052,u+.052,.09,.97,-2.31,-2.19,lintel)
        if i < 7:
            for h in (.43,.81):
                f.surface([(u,-2.26,h),(u+.41,-2.26,h-.081),(u+.82,-2.26,h),
                           (u+.82,-2.26,h+.031),(u+.41,-2.26,h-.05),(u,-2.26,h+.031)],ivory)
    mesh.export("The Esplanade shore shops", REGION / "assets/esplanade-shops.glb")


if __name__ == "__main__":
    targets = sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else []
    for name, build in (("inn",inn),("picnic",picnic),("shore-shops",shore_shops)):
        if not targets or name in targets:
            build()
