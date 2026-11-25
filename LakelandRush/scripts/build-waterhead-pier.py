"""Run with blender -b -t 2 -P scripts/build-waterhead-pier.py."""
import bpy
import json
import math
from pathlib import Path
from mathutils import Vector
from mathutils.geometry import tessellate_polygon

ROOT = Path(__file__).resolve().parents[1]
REGION = ROOT / "public/regions/windermere"
BUILDING_ID = 423828335
chunk = json.loads((REGION / "chunks/0_-1.json").read_text())
footprint = next(b["pts"] for b in chunk["buildings"] if b["id"] == BUILDING_ID)
bpy.ops.wm.read_factory_settings(use_empty=True)
materials = []
positions, faces, slots = [], [], []


def material(name, color, roughness):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Roughness"].default_value = roughness
    materials.append(mat)
    return len(materials) - 1


cream = material("Ivory clapboard", (0.73, 0.71, 0.61), 0.85)
green = material("Deep green joinery", (0.028, 0.124, 0.072), 0.66)
slate = material("Blue grey slate", (0.063, 0.078, 0.084), 0.89)
glass = material("Deep window glass", (0.087, 0.13, 0.145), 0.23)
stone = material("Dark plinth", (0.14, 0.14, 0.12), 0.93)

# Local u follows the lakeside footprint edge southward. Depth points inland.
a, b = [Vector(footprint[i]) for i in (3, 5)]
u_axis = (b - a).normalized()
depth_axis = Vector((u_axis.y, -u_axis.x))
origin = (a + b) * 0.5


def local(u, depth, h):
    point = origin + u_axis * u + depth_axis * depth
    return (point.x, -point.y, h)


def face(vertices, surface):
    indices = list(range(len(positions), len(positions) + len(vertices)))
    positions.extend(vertices)
    faces.append(indices)
    slots.append(surface)


def polygon_prism(points, low, high, surface):
    def at(point, h):
        return (point[0], -point[1], h)
    for i, a in enumerate(points):
        b = points[(i + 1) % len(points)]
        face([at(a, low), at(b, low), at(b, high), at(a, high)], surface)
    top = [Vector(at(p, high)) for p in points]
    for tri in tessellate_polygon([top]):
        face([top[index] for index in tri], surface)


def panel(u0, u1, h0, h1, depth, surface):
    face([local(u0, depth, h0), local(u1, depth, h0),
          local(u1, depth, h1), local(u0, depth, h1)], surface)


def trim(u0, h0, u1, h1, width, depth, surface=green):
    length = math.hypot(u1 - u0, h1 - h0)
    du, dh = -(h1 - h0) * width / (2 * length), (u1 - u0) * width / (2 * length)
    face([local(u0 - du, depth, h0 - dh), local(u1 - du, depth, h1 - dh),
          local(u1 + du, depth, h1 + dh), local(u0 + du, depth, h0 + dh)], surface)


def gable(left, right, eave, ridge, back, colour):
    mid = (left + right) / 2
    for depth in (-0.31, back):
        face([local(left, depth, eave), local(right, depth, eave),
              local(mid, depth, ridge)], colour)
    face([local(left, -0.56, eave), local(mid, -0.56, ridge),
          local(mid, back + 0.24, ridge), local(left, back + 0.24, eave)], slate)
    face([local(mid, -0.56, ridge), local(right, -0.56, eave),
          local(right, back + 0.24, eave), local(mid, back + 0.24, ridge)], slate)
    trim(left, eave, mid, ridge, 0.16, -0.59)
    trim(mid, ridge, right, eave, 0.16, -0.59)


def window(u0, u1, h0, h1):
    panel(u0, u1, h0, h1, -0.37, cream)
    panel(u0 + 0.085, u1 - 0.085, h0 + 0.085, h1 - 0.085, -0.395, glass)
    centre = (u0 + u1) / 2
    trim(centre, h0, centre, h1, 0.065, -0.44, cream)
    trim(u0, h0 + (h1 - h0) * 0.68, u1, h0 + (h1 - h0) * 0.68, 0.065, -0.44, cream)


polygon_prism(footprint, -1.15, 0.28, stone)
polygon_prism(footprint, 0.23, 3.28, cream)
panel(-9.55, 9.55, 0.28, 3.26, -0.31, cream)
for height in range(4, 32):
    if height % 2 == 0:
        trim(-9.5, height / 10, 9.5, height / 10, 0.021, -0.322, stone)
gable(-9.85, 2.45, 3.25, 6.05, 8.35, cream)
# Lower slate roof above the glazed south wing.
face([local(2.4, -0.56, 3.08), local(9.85, -0.56, 3.08),
      local(9.85, 7.6, 4.42), local(2.4, 7.6, 4.42)], slate)
face([local(9.75, -0.45, 3.06), local(9.75, 7.55, 4.40),
      local(9.75, 7.55, 3.06)], cream)

for start in (-9.4, -7.6, -5.65, -2.4, -0.2, 2.05):
    trim(start, 0.25, start, 3.4, 0.16, -0.46)
for height in (0.34, 2.63, 3.34):
    trim(-9.5, height, 2.3, height, 0.15, -0.48)
for left, right in ((-9.15, -7.8), (-7.37, -5.85), (-2.19, -0.4), (0.01, 1.85)):
    trim(left, 2.73, right, 3.21, 0.095, -0.48)
    trim(right, 2.73, left, 3.21, 0.095, -0.48)
for center in (-8.55, -6.65, -1.28, 0.91, 3.13, 4.49, 5.85, 7.21, 8.57):
    window(center - 0.51, center + 0.51, 0.76, 2.47)
panel(-5.3, -3.24, 0.31, 2.55, -0.39, green)
window(-5.05, -3.49, 0.98, 2.41)
# Tall pointed window and painted framing beneath the lake-facing gable.
arch = [(-5.05, 3.57), (-5.05, 4.42), (-4.79, 4.95), (-3.69, 5.63),
        (-2.64, 4.95), (-2.34, 4.42), (-2.34, 3.57)]
face([local(u, -0.42, h) for u, h in arch], glass)
for (u0, h0), (u1, h1) in zip(arch, arch[1:] + arch[:1]):
    trim(u0, h0, u1, h1, 0.13, -0.47)
trim(-3.69, 3.57, -3.69, 5.61, 0.1, -0.49, cream)
trim(-5.02, 4.32, -2.37, 4.32, 0.075, -0.49, cream)
trim(2.45, 0.4, 9.68, 0.4, 0.45, -0.46)
trim(2.45, 2.6, 9.68, 2.6, 0.16, -0.46)

mesh = bpy.data.meshes.new("Booking office")
mesh.from_pydata(positions, [], faces)
mesh.update()
for mat in materials:
    mesh.materials.append(mat)
for polygon, slot in zip(mesh.polygons, slots):
    polygon.material_index = slot
obj = bpy.data.objects.new("Ambleside Pier booking office", mesh)
bpy.context.collection.objects.link(obj)
obj.select_set(True)
bpy.context.view_layer.objects.active = obj
# The facade is built from directional panels. Keep both sides visible in glTF.
for mat in materials:
    mat.use_backface_culling = False
out = REGION / "assets"
out.mkdir(exist_ok=True)
bpy.ops.export_scene.gltf(filepath=str(out / "ambleside-pier.glb"), export_format="GLB")
