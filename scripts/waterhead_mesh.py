"""Small Blender mesh authoring library. Coordinates follow the game (east, south, up)."""
import math
import bpy
from mathutils import Vector
from mathutils.geometry import tessellate_polygon


class Mesh:
    def __init__(self):
        self.vertices, self.faces, self.slots, self.uvs = [], [], [], []
        self.materials = []

    def material(self, name, color, roughness, metal=0):
        mat = bpy.data.materials.new(name)
        mat.use_nodes = True
        shader = mat.node_tree.nodes.get("Principled BSDF")
        shader.inputs["Base Color"].default_value = (*color, 1)
        shader.inputs["Roughness"].default_value = roughness
        shader.inputs["Metallic"].default_value = metal
        self.materials.append(mat)
        return len(self.materials) - 1

    def face(self, vertices, material, uv=None):
        points = [Vector((x, -z, y)) for x, z, y in vertices]
        if uv is None:
            axis = (points[1] - points[0]).normalized()
            normal = (points[1] - points[0]).cross(points[-1] - points[0]).normalized()
            across = normal.cross(axis)
            uv = [(p.dot(axis), p.dot(across)) for p in points]
        self.uvs.extend(uv)
        self.faces.append(tuple(range(len(self.vertices), len(self.vertices) + len(points))))
        self.vertices.extend(points)
        self.slots.append(material)

    def cap(self, points, height, material):
        mesh_points = [Vector((x, -z, 0)) for x, z in points]
        for triangle in tessellate_polygon([mesh_points]):
            self.face([(points[i][0], points[i][1], height) for i in triangle], material)

    def export(self, name, output):
        data = bpy.data.meshes.new(name)
        data.from_pydata(self.vertices, [], self.faces)
        data.update()
        for mat in self.materials:
            data.materials.append(mat)
        uv = data.uv_layers.new()
        for polygon, material in zip(data.polygons, self.slots):
            polygon.material_index = material
        for i, point in enumerate(self.uvs):
            uv.data[i].uv = point
        obj = bpy.data.objects.new(name, data)
        bpy.context.collection.objects.link(obj)
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
        bpy.ops.export_scene.gltf(filepath=str(output), export_format="GLB", use_selection=True)


class Elevation:
    def __init__(self, mesh, start, end, inward=1):
        self.mesh = mesh
        self.start = start
        delta = (end[0] - start[0], end[1] - start[1])
        self.width = math.hypot(*delta)
        self.axis = (delta[0] / self.width, delta[1] / self.width)
        self.normal = (-self.axis[1] * inward, self.axis[0] * inward)

    def point(self, u, depth, h):
        x, z = self.start
        return (x + self.axis[0] * u + self.normal[0] * depth,
                z + self.axis[1] * u + self.normal[1] * depth, h)

    def surface(self, coords, material, uv=None):
        self.mesh.face([self.point(*p) for p in coords], material, uv)

    def panel(self, u0, u1, h0, h1, d, material):
        self.surface([(u0, d, h0), (u1, d, h0), (u1, d, h1), (u0, d, h1)],
                     material, [(u0, h0), (u1, h0), (u1, h1), (u0, h1)])

    def block(self, u0, u1, h0, h1, d0, d1, material):
        self.panel(u0, u1, h0, h1, d0, material)
        self.panel(u1, u0, h0, h1, d1, material)
        for u in (u0, u1):
            self.surface([(u, d0, h0), (u, d1, h0), (u, d1, h1), (u, d0, h1)], material)
        for h in (h0, h1):
            self.surface([(u0, d0, h), (u1, d0, h), (u1, d1, h), (u0, d1, h)], material)

    def frame(self, u0, u1, h0, h1, depth, frame, glass, mullions=1, transom=True):
        rim = min(.10, (u1-u0)*.16)
        for u in (u0, u1-rim):
            self.block(u, u+rim, h0, h1, depth, depth+.07, frame)
        for h in (h0, h1-rim):
            self.block(u0+rim, u1-rim, h, h+rim, depth, depth+.07, frame)
        self.panel(u0+rim, u1-rim, h0+rim, h1-rim, depth+.065, glass)
        for k in range(mullions):
            u = u0+(k+1)*(u1-u0)/(mullions+1)
            self.block(u-.025, u+.025, h0+rim, h1-rim, depth-.012, depth+.071, frame)
        if transom:
            h = h0+(h1-h0)*.68
            self.block(u0+rim, u1-rim, h-.026, h+.026, depth-.012, depth+.071, frame)

    def apertures(self, low, high, wall, openings, trim, glass):
        """Cut rectangular openings from the facade and build each reveal and sill."""
        xs = sorted({0, self.width, *(u for o in openings for u in o[:2])})
        for u0, u1 in zip(xs, xs[1:]):
            holes = sorted((h0, h1) for a, b, h0, h1 in openings if a <= u0 and b >= u1)
            y = low
            for h0, h1 in holes:
                if h0 > y:
                    self.panel(u0, u1, y, h0, 0, wall)
                y = h1
            if y < high:
                self.panel(u0, u1, y, high, 0, wall)
        for a, b, h0, h1 in openings:
            for u in (a, b):
                self.surface([(u, 0, h0), (u, .16, h0), (u, .16, h1), (u, 0, h1)], wall)
            for h in (h0, h1):
                self.surface([(a, 0, h), (b, 0, h), (b, .16, h), (a, .16, h)], wall)
            self.frame(a, b, h0, h1, .095, trim, glass)
            self.block(a-.08, b+.08, h0-.09, h0, -.09, .1, wall)

    def lettering(self, text, u, h, maximum_width, height, depth, mat):
        curve = bpy.data.curves.new("Sign lettering", "FONT")
        curve.body = text
        curve.align_x = "CENTER"
        obj = bpy.data.objects.new("Sign lettering", curve)
        bpy.context.collection.objects.link(obj)
        bpy.context.view_layer.update()
        evaluated = obj.evaluated_get(bpy.context.evaluated_depsgraph_get())
        data = evaluated.to_mesh()
        scale = min(maximum_width / obj.dimensions.x, height / obj.dimensions.y)
        data.calc_loop_triangles()
        for triangle in data.loop_triangles:
            coords = [(u + data.vertices[i].co.x * scale, depth,
                       h + data.vertices[i].co.y * scale) for i in triangle.vertices]
            self.surface(coords, mat)
        evaluated.to_mesh_clear()
        bpy.data.objects.remove(obj, do_unlink=True)
        bpy.data.curves.remove(curve)

    def gabled(self, u0, u1, d0, d1, eave, ridge, wall, roof, trim=None):
        m = (u0+u1)/2
        for d in (d0, d1):
            self.surface([(u0,d,eave), (u1,d,eave), (m,d,ridge)], wall)
        for u in (u0, u1):
            self.surface([(u,d0-.15,eave+.03), (m,d0-.15,ridge+.03),
                          (m,d1+.15,ridge+.03), (u,d1+.15,eave+.03)], roof)
            if trim is not None:
                self.surface([(u,d0-.16,eave+.03), (m,d0-.16,ridge+.03),
                              (m,d0-.16,ridge-.12), (u,d0-.16,eave-.12)], trim)
