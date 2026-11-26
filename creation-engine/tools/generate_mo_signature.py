"""Original ELASRAG MO signature sculpture. Blender 4.3+, no external assets.
Run: blender -b --python creation-engine/tools/generate_mo_signature.py -- --render
The M is the person; the open O is a framework connecting four capabilities.
Exports preserve Z depth and front-facing XY typography. Procedural source is master.
"""
import bpy, math, os, sys, argparse, json
from bpy_extras.object_utils import world_to_camera_view
from collections import defaultdict
from mathutils import Vector, Matrix
p=argparse.ArgumentParser();p.add_argument('--output',default=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','assets')));p.add_argument('--render',action='store_true')
args=p.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
out=os.path.abspath(args.output);os.makedirs(out,exist_ok=True)
bpy.context.preferences.filepaths.save_version=0
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
def material(name,color,metal=0,rough=.3,emission=None,transmission=0):
 m=bpy.data.materials.new(name); m.use_nodes=True; n=m.node_tree.nodes.get('Principled BSDF'); n.inputs['Base Color'].default_value=(*color,1); n.inputs['Metallic'].default_value=metal; n.inputs['Roughness'].default_value=rough
 if emission: n.inputs['Emission Color'].default_value=(*emission,1); n.inputs['Emission Strength'].default_value=3
 if transmission: n.inputs['Transmission Weight'].default_value=transmission; n.inputs['IOR'].default_value=1.46
 return m
TI=material('Titanium · satin',(.32,.35,.38),.92,.32)
POL=material('Titanium · diamond cut',(.69,.72,.75),1,.19)
DARK=material('Graphite · ceramic',(.018,.024,.03),.30,.48)
CORE=material('Energy · warm white',(.82,.9,1),.18,.22,(.76,.87,1))
AMBER=material('Copper · brushed champagne',(.48,.27,.12),.88,.31)
components=[]
def component(name,loc=(0,0,0),explode=(0,0,0),role='housing',rot=(0,0,0)):
 o=bpy.data.objects.new(name,None); bpy.context.collection.objects.link(o); o.location=loc; o.rotation_euler=rot; o['explode']=list(explode); o['role']=role; o['component']=True; components.append(o); return o

def mesh(name,verts,faces,mat,parent,bevel=.015):
 me=bpy.data.meshes.new(name); me.from_pydata(verts,[],faces); me.update(); o=bpy.data.objects.new(name,me); bpy.context.collection.objects.link(o); o.parent=parent; o.data.materials.append(mat)
 if bevel:
  mod=o.modifiers.new('Machined edge radii','BEVEL'); mod.width=bevel; mod.segments=2
  bpy.context.view_layer.objects.active=o; o.select_set(True); bpy.ops.object.modifier_apply(modifier=mod.name); o.select_set(False)
 for f in o.data.polygons: f.use_smooth=True
 mod=o.modifiers.new('Weighted machining normals','WEIGHTED_NORMAL'); mod.keep_sharp=True
 bpy.context.view_layer.objects.active=o; o.select_set(True); bpy.ops.object.modifier_apply(modifier=mod.name); o.select_set(False)
 return o

def arc(name,ri,ro,z,depth,start,end,mat,parent,n=64,bevel=.012):
 verts=[]
 for zz in [z-depth/2,z+depth/2]:
  for r in [ri,ro]:
   for i in range(n+1):
    a=start+(end-start)*i/n; verts.append((r*math.cos(a),r*math.sin(a),zz))
 s=n+1; faces=[]
 for i in range(n):
  faces.extend([(i,i+1,s+i+1,s+i),(2*s+i,3*s+i,3*s+i+1,2*s+i+1),(i,2*s+i,2*s+i+1,i+1),(s+i,s+i+1,3*s+i+1,3*s+i)])
 faces.extend([(0,s,3*s,2*s),(n,2*s+n,3*s+n,s+n)])
 return mesh(name,verts,faces,mat,parent,bevel)

def ring(name,ri,ro,z,depth,mat,parent,n=96,bevel=.012): return arc(name,ri,ro,z,depth,0,math.tau,mat,parent,n,bevel)
def cube(name,loc,scale,mat,parent,bevel=.025,rotz=0):
 bpy.ops.mesh.primitive_cube_add(size=1); o=bpy.context.object; o.name=name; o.parent=parent; o.location=loc; o.scale=scale; o.rotation_euler.z=rotz; bpy.ops.object.transform_apply(location=False,rotation=False,scale=True); o.data.materials.append(mat)
 mod=o.modifiers.new('CNC fillet','BEVEL');mod.width=bevel;mod.segments=3; bpy.ops.object.modifier_apply(modifier=mod.name)
 for f in o.data.polygons:f.use_smooth=True
 mod=o.modifiers.new('Weighted normals','WEIGHTED_NORMAL');bpy.ops.object.modifier_apply(modifier=mod.name);o.select_set(False);return o

def cyl(name,loc,radius,depth,mat,parent,vertices=24):
 bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=radius,depth=depth);o=bpy.context.object;o.name=name;o.parent=parent;o.location=loc;o.data.materials.append(mat)
 mod=o.modifiers.new('Turned edge','BEVEL');mod.width=.008;mod.segments=2;bpy.ops.object.modifier_apply(modifier=mod.name)
 for f in o.data.polygons:f.use_smooth=True
 o.select_set(False);return o


def bar(name,a,b,width,depth,z,mat,parent,bevel=.012):
 dx=b[0]-a[0];dy=b[1]-a[1]
 return cube(name,((a[0]+b[0])/2,(a[1]+b[1])/2,z),(math.hypot(dx,dy),width,depth),mat,parent,bevel,math.atan2(dy,dx))
def polygon_ccw(poly):
 # Consistent outward winding matters to exported PBR normals, even for double-sided materials.
 area=sum(poly[i][0]*poly[(i+1)%len(poly)][1]-poly[(i+1)%len(poly)][0]*poly[i][1] for i in range(len(poly)))
 return list(poly) if area>0 else list(reversed(poly))
def inset_polygon(poly,distance):
 # Offset each edge toward the polygon interior, intersecting neighbouring offset lines.
 # Unlike global scaling, this preserves a constant reveal around concave M cut-outs.
 poly=polygon_ccw(poly);result=[]
 for i,p in enumerate(poly):
  prev=poly[i-1];nxt=poly[(i+1)%len(poly)]
  e1=Vector((p[0]-prev[0],p[1]-prev[1])).normalized();e2=Vector((nxt[0]-p[0],nxt[1]-p[1])).normalized()
  q1=Vector(p)+Vector((-e1.y,e1.x))*distance;q2=Vector(p)+Vector((-e2.y,e2.x))*distance
  cross=e1.x*e2.y-e1.y*e2.x
  if abs(cross)<1e-8:result.append(tuple(q1));continue
  delta=q2-q1;t=(delta.x*e2.y-delta.y*e2.x)/cross
  result.append(tuple(q1+e1*t))
 return result
def extrude(name,poly,z,depth,mat,parent,bevel=.025):
 poly=polygon_ccw(poly)
 verts=[(x,y,z-depth/2) for x,y in poly]+[(x,y,z+depth/2) for x,y in poly];n=len(poly)
 faces=[tuple(range(n-1,-1,-1)),tuple(range(n,2*n))]+[(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]
 return mesh(name,verts,faces,mat,parent,bevel)
def screw(parent,loc,r=.035):
 cyl('Recessed fastener',loc,r,.025,POL,parent,12)
 cyl('Socket',(loc[0],loc[1],loc[2]+.014),r*.40,.006,DARK,parent,6)

# The monogram is a load-bearing continuous machined M, not pasted-on lettering.
mo=component('Mo_Core',explode=(0,0,.5),role='core');mo['capability']='mo';mo['label']='Mo'
outline=[(-1.16,-1.06),(-1.16,1.12),(-.77,1.12),(0,.15),(.77,1.12),(1.16,1.12),(1.16,-1.06),(.77,-1.06),(.77,.39),(.12,-.43),(-.12,-.43),(-.77,.39),(-.77,-1.06)]
extrude('Continuous titanium M frame',outline,.04,.38,TI,mo,.035)
# A recessed graphite face preserves the visible titanium bevel and adds depth.
face=inset_polygon(outline,.055)
extrude('Inset graphite M face',face,.239,.036,DARK,mo,.014)
# The four construction members are traced with restrained, warm-white conductor strips.
for a,b in [((-.969,-.75),(-.969,.84)),((-.83,.91),(0,-.17)),((0,-.17),(.83,.91)),((.969,.84),(.969,-.75))]:
 bar('Recessed conductor',a,b,.018,.012,.267,CORE,mo,.004)
for x in [-.967,.967]:
 cube('Copper foot ferrule',(x,-.975,.051),(.393,.19,.40),AMBER,mo,.026)
 for y in [-.64,.67]:screw(mo,(x,y,.275),.031)
# The centre vertex has an intentional joint and a small personal signature datum.
cyl('Monogram vertex datum',(0,-.20,.282),.065,.027,POL,mo,24)
cyl('Monogram white datum',(0,-.20,.30),.025,.007,CORE,mo,20)

# The O is a broken, indexed support rail. Large open spaces retain a legible monogram.
frame=component('O_Frame',explode=(0,0,-.35),role='housing')
for quadrant in range(4):
 a=math.pi/4+quadrant*math.pi/2
 arc('Graphite O backbone',1.91,2.13,-.17,.22,a+.14,a+math.pi/2-.14,DARK,frame,28,.025)
 arc('Titanium O face',1.975,2.105,-.039,.055,a+.17,a+math.pi/2-.17,TI,frame,28,.012)
 arc('Polished outer chamfer',2.105,2.128,-.055,.045,a+.18,a+math.pi/2-.18,POL,frame,28,.008)
 # Four sockets are physically separated from their removable capability cartridges.
 for aa in [a+.17,a+math.pi/2-.17]:
  rr=2.02;screw(frame,(rr*math.cos(aa),rr*math.sin(aa),.001),.027)
 # A sparse calibrated mark at the middle of each arc.
 mid=a+math.pi/4
 for j in [-1,0,1]:
  aa=mid+j*.055
  arc('Indexed rail mark',2.015,2.072,.000,.006,aa-.006,aa+.006,AMBER,frame,1,.001)
# One copper segment gives the signature a deliberate asymmetry.
arc('Copper signature segment',1.977,2.103,.001,.018,math.radians(83),math.radians(110),AMBER,frame,15,.007)

bridges=component('Connection_Bridges',explode=(0,0,-.65),role='stator')
for side in [-1,1]:
 for y in [-.75,.75]:
  a=(side*1.13,y);rr=math.sqrt(1.94**2-y*y);b=(side*rr,y)
  bar('Structural bridge',a,b,.15,.18,-.14,TI,bridges,.022)
  bar('Bridge graphite inlay',a,b,.065,.021,-.036,DARK,bridges,.007)
  bar('Connection strip',(side*1.22,y),(side*(rr-.07),y),.013,.008,-.018,CORE,bridges,.003)

# Four tactile, knurled capability cartridges replace generic orbiting dots.
node_defs=[('Technology','technology',135),('AI','ai',45),('Design','design',315),('Strategy','strategy',225)]
for title,key,degrees in node_defs:
 a=math.radians(degrees);r=2.025
 node=component('Node_'+title,(r*math.cos(a),r*math.sin(a),-.06),(.5*math.cos(a),.5*math.sin(a),.25),'pod');node['capability']=key;node['label']=title;node['hotspot']=[0,0,.26]
 # A rectangular radial carriage locks into the gap in the O rail.
 cube('Radial cartridge carriage',(0,0,-.10),(.38,.44,.19),TI,node,.045,a)
 cyl('Knurled selector shell',(0,0,.06),.225,.29,AMBER,node,32)
 for tooth in range(20):
  aa=math.tau*tooth/20
  cube('Selector machined knurl',(.222*math.cos(aa),.222*math.sin(aa),.055),(.028,.024,.20),DARK,node,.003,aa)
 cyl('Graphite control face',(0,0,.218),.191,.055,DARK,node,40)
 ring('Polished selector bezel',.184,.206,.233,.041,POL,node,40,.007)
 # Four distinct raised circuit glyphs, all built from geometry.
 z=.253
 if key=='technology':
  for x,h in [(-.075,.12),(0,.19),(.075,.15)]:bar('Technology circuit', (x,-h/2),(x,h/2),.020,.010,z,CORE,node,.003)
  for x,y in [(-.075,.06),(0,-.095),(.075,.075)]:cyl('Technology terminal',(x,y,z+.009),.022,.008,AMBER,node,12)
 elif key=='ai':
  pts=[(-.092,-.06),(.092,-.06),(0,.102)]
  for j in range(3):bar('AI network connection',pts[j],pts[(j+1)%3],.013,.009,z,CORE,node,.003)
  for x,y in pts:cyl('AI network node',(x,y,z+.008),.027,.012,AMBER,node,16)
 elif key=='design':
  for aa,bb in [((-.10,-.08),(-.10,.09)),((-.10,-.08),(.07,-.08)),((-.05,-.03),(.10,.12))]:bar('Design geometry glyph',aa,bb,.019,.012,z,CORE,node,.003)
  cyl('Design stylus nib',(.10,.12,z+.005),.025,.012,AMBER,node,12)
 else:
  pts=[(0,.12),(.10,0),(0,-.12),(-.10,0)]
  for j in range(4):bar('Strategy compass',pts[j],pts[(j+1)%4],.014,.012,z,CORE,node,.003)
  bar('Strategy axis',(0,-.065),(0,.065),.026,.012,z+.005,AMBER,node,.004)

# Combine each component by material while preserving its named pivot and extras.
for root in components:
 groups=defaultdict(list)
 for child in list(root.children):
  if child.type=='MESH':groups[child.data.materials[0].name].append(child)
 for mat,objs in groups.items():
  bpy.ops.object.select_all(action='DESELECT')
  for o in objs:o.select_set(True)
  bpy.context.view_layer.objects.active=objs[0]
  if len(objs)>1:bpy.ops.object.join()
  o=bpy.context.object;o.name=root.name+'__'+mat.split(' ·')[0].replace(' ','_');bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
root=bpy.data.objects.new('ELASRAG_MO_Signature',None);bpy.context.collection.objects.link(root);root['version']='1.0';root['axis']='Z';root['design']='Personal M monogram inside open O capability framework';root['license']='Original ELASRAG asset'
for o in components:o.parent=root
bpy.ops.object.select_all(action='DESELECT');root.select_set(True)
for o in root.children_recursive:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(out,'mo-signature.glb'),export_format='GLB',use_selection=True,export_yup=False,export_extras=True,export_apply=True,export_cameras=False,export_lights=False,export_animations=False)

world=bpy.data.worlds.new('MO exhibition');world.use_nodes=True;world.node_tree.nodes['Background'].inputs[0].default_value=(.025,.032,.045,1);world.node_tree.nodes['Background'].inputs[1].default_value=.23;bpy.context.scene.world=world
def point_at(o,p=(0,0,0)):o.rotation_euler=(Vector(p)-o.location).to_track_quat('-Z','Y').to_euler()
def light(name,loc,power,color,size):
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.name=name;o.data.energy=power;o.data.color=color;o.data.shape='DISK';o.data.size=size;point_at(o)
light('Key softbox',(2,-1,7),1000,(.9,.95,1),5)
light('Copper rim',(-4,1,3),1300,(1,.82,.62),4)
light('Top reflection',(0,5,2),1200,(.8,.9,1),4)
bpy.ops.object.camera_add(location=(3.4,1.5,12));cam=bpy.context.object;point_at(cam);forward=(-cam.location).normalized();right=forward.cross(Vector((0,1,0))).normalized();up=right.cross(forward);cam.rotation_euler=Matrix((right,up,-forward)).transposed().to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=5.5;bpy.context.scene.camera=cam
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=128;scene.cycles.use_denoising=False;scene.render.resolution_x=1200;scene.render.resolution_y=1200;scene.render.resolution_percentage=100;scene.render.film_transparent=True;scene.view_settings.view_transform='AgX';scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA';scene.render.filepath=os.path.join(out,'mo-poster.png')
def write_poster_hotspots(scene,components,out):
 # Match the exact offline poster camera. Coordinates are fractions from top-left.
 # The personal M uses its existing origin anchor, matching the WebGL projection contract.
 bpy.context.view_layer.update()
 anchors={}
 for obj in components:
  if not obj.get('capability'):continue
  world=obj.matrix_world @ Vector(obj.get('hotspot',[0,0,0]))
  point=world_to_camera_view(scene,scene.camera,world)
  anchors[obj['capability']]={'x':round(point.x,8),'y':round(1-point.y,8)}
 payload={'width':scene.render.resolution_x,'height':scene.render.resolution_y,'coordinateSystem':'normalized-top-left','anchors':anchors}
 with open(os.path.join(out,'mo-poster-hotspots.json'),'w') as f:json.dump(payload,f,indent=2);f.write('\n')
 with open(os.path.join(out,'mo-poster-hotspots.js'),'w') as f:f.write('// Generated from the Blender poster camera. Do not position these by eye.\nexport default '+json.dumps(payload,indent=2)+';\n')
 return payload
write_poster_hotspots(scene,components,out)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,'mo-signature.blend'),compress=True)
if args.render:bpy.ops.render.render(write_still=True)
print('MO_SIGNATURE_COMPLETE',os.path.join(out,'mo-signature.glb'))
