"""ELASRAG Creation Engine 01. Original editable procedural mechanical sculpture.
Blender 4.3+: blender -b --python generate_engine.py -- --output ./assets
No external assets, fonts, textures or add-ons required. Units: metres (exhibition scale).
Export preserves Z as the cartridge axis; WebGL loader should not rotate axes.
"""
import bpy, math, os, sys, argparse
from mathutils import Vector
from collections import defaultdict
p=argparse.ArgumentParser(); p.add_argument('--output',default=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','assets'))); p.add_argument('--render',action='store_true')
args=p.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
out=os.path.abspath(args.output); os.makedirs(out,exist_ok=True)
bpy.context.preferences.filepaths.save_version=0
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
for block in list(bpy.data.materials): bpy.data.materials.remove(block)

def material(name,color,metal=0,rough=.3,emission=None,transmission=0):
 m=bpy.data.materials.new(name); m.use_nodes=True; n=m.node_tree.nodes.get('Principled BSDF'); n.inputs['Base Color'].default_value=(*color,1); n.inputs['Metallic'].default_value=metal; n.inputs['Roughness'].default_value=rough
 if emission: n.inputs['Emission Color'].default_value=(*emission,1); n.inputs['Emission Strength'].default_value=3
 if transmission: n.inputs['Transmission Weight'].default_value=transmission; n.inputs['IOR'].default_value=1.46
 return m
TI=material('Titanium · satin',(.32,.35,.38),.94,.29)
POL=material('Titanium · diamond cut',(.69,.72,.75),1,.19)
DARK=material('Graphite · ceramic',(.025,.032,.04),.77,.35)
CORE=material('Energy · warm white',(.82,.9,1),.18,.22,(.76,.87,1))
AMBER=material('Index · ivory',(.92,.8,.52),.7,.29)
GLASS=material('Glass · smoked optical',(.3,.36,.4),.05,.06,transmission=.94)
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

def bolts(parent,r,z,num=12):
 for i in range(num):
  a=math.tau*i/num;cyl('Recessed titanium fastener', (r*math.cos(a),r*math.sin(a),z),.047,.035,POL,parent,vertices=6)
  cyl('Hex socket',(r*math.cos(a),r*math.sin(a),z+.019),.021,.003,DARK,parent,vertices=6)

# A central optical cartridge, floating between two bearing housings.
core=component('01_Core_cartridge',role='core')
cyl('Luminous axial capsule',(0,0,0),.37,1.5,CORE,core,64)
for z in [-.78,.78]:
 ring('Core end ferrule',.29,.48,z,.13,POL,core,64)
 ring('Core insulator',.37,.51,z*.81,.06,DARK,core,64)
for i in range(8):
 a=i*math.tau/8;cube('Core containment rail',(.47*math.cos(a),.47*math.sin(a),0),(.05,.05,1.52),TI,core,.012,a)
for z in [-.45,-.15,.15,.45]:ring('Energy circulation band',.375,.41,z,.025,CORE,core,64,.004)

cage=component('02_Stator_cage',role='stator')
for z in [-.77,.77]:
 ring('Bearing outer race',.64,.91,z,.18,DARK,cage)
 ring('Bearing polished face',.68,.86,z+.1,.025,POL,cage)
 ring('Bearing inner race',.49,.61,z,.2,POL,cage)
 for i in range(18):
  a=math.tau*i/18; cyl('Bearing roller',(.625*math.cos(a),.625*math.sin(a),z+.04),.037,.16,TI,cage,16)
for i in range(6):
 a=math.tau*i/6
 cube('Axial bridge',(.98*math.cos(a),.98*math.sin(a),0),(.17,.16,1.8),DARK,cage,.035,a)
 cube('Bridge inlay',(1.075*math.cos(a),1.075*math.sin(a),0),(.018,.048,1.27),POL,cage,.008,a)

for side,label in [(1,'Front'),(-1,'Rear')]:
 z=side*.93
 collar=component('03_'+label+'_bearing_housing',(0,0,z),(0,0,side*1.65),'housing')
 ring('Outer machined collar',1.43,1.81,0,.23,TI,collar)
 ring('Knife edge outer trim',1.785,1.84,.02,.11,POL,collar)
 ring('Graphite circumferential groove',1.65,1.71,side*.122,.012,DARK,collar)
 ring('Inner race lip',1.385,1.46,.02,.27,POL,collar)
 bolts(collar,1.55,side*.13,12)
 for i in range(12):
  a=math.tau*i/12
  arc('Radial index engraving',1.73,1.78,side*.124,.007,a-.012,a+.012,AMBER if i%3==0 else DARK,collar,2,.001)
  arc('Rear cooling slot',1.48,1.59,-side*.117,.012,a+.08,a+.23,DARK,collar,5,.003)
 # Radial turbine plane with orderly same-direction twisted vanes.
 rotor=component('04_'+label+'_rotor',(0,0,side*.62),(0,0,side*.85),'rotor')
 ring('Rotor hub',.50,.68,0,.18,POL,rotor)
 ring('Rotor perimeter',1.26,1.4,0,.12,TI,rotor)
 for i in range(18):
  a=math.tau*i/18
  def v(r,aa,zz):return(r*math.cos(aa+a),r*math.sin(aa+a),zz)
  verts=[v(.68,-.04,-.035),v(1.3,.10,-.035),v(1.3,.22,.025),v(.68,.08,.1),v(.68,-.04,-.005),v(1.3,.10,-.005),v(1.3,.22,.055),v(.68,.08,.13)]
  mesh('Swept rotor blade',verts,[(0,1,2,3),(4,7,6,5),(0,4,5,1),(1,5,6,2),(2,6,7,3),(3,7,4,0)],TI,rotor,.009)
 glass=component('05_'+label+'_optical_shield',(0,0,side*1.12),(0,0,side*2.15),'glass')

 for panel in range(6):
  aa=math.tau*panel/6
  arc('Smoked optical inspection panel',.53,1.37,0,.038,aa+.10,aa+.66,GLASS,glass,12,.007)
 ring('Optical shield outer gasket',1.35,1.4,0,.06,DARK,glass)
 ring('Optical shield inner gasket',.51,.55,0,.06,DARK,glass)

# Six replaceable field-stator pods lock between the bearing collars.
for i in range(6):
 a=math.tau*i/6
 r=1.53
 pod=component('06_Field_pod_%02d'%(i+1),(r*math.cos(a),r*math.sin(a),0),(.8*math.cos(a),.8*math.sin(a),0),'pod',rot=(0,0,a))
 cube('Field cassette spine',(0,0,0),(.28,.31,1.5),DARK,pod,.055)
 cube('Field cassette armour',(.15,0,0),(.10,.29,1.06),TI,pod,.025)
 cube('Conduction inlay',(.205,0,0),(.014,.035,.81),CORE,pod,.005)
 for j in range(7):
  cube('Heat sink fin',(.03,0,(j-3)*.133),(.30,.40,.037),TI,pod,.01)
 for z in [-.78,.78]:cube('Cassette coupling',(0,0,z),(.33,.36,.15),POL,pod,.025)

# Independent coaxial gimbal bands, with split-line housings and indexed pivots.
for num,(r,rot) in enumerate([(2.03,(.34,-.28,.10)),(2.25,(-.56,.31,-.28))]):
 g=component('07_Gimbal_%02d'%(num+1),explode=(0,(num+1)*.28,0),role='gimbal',rot=rot)
 for i in range(4):
  a=math.tau*i/4
  arc('Quadrant titanium hoop',r-.055,r+.055,0,.13,a+.045,a+math.pi/2-.045,TI,g,24,.016)
  arc('Polished hoop bevel',r+.055,r+.071,0,.06,a+.045,a+math.pi/2-.045,POL,g,24,.008)
 for i in range(4):
  a=math.tau*i/4
  cube('Gimbal journal block',(r*math.cos(a),r*math.sin(a),0),(.20,.21,.23),DARK,g,.035,a)
  cyl('Journal pin',(r*math.cos(a),r*math.sin(a),.13),.065,.09,POL,g,24)
  cyl('Journal inset',(r*math.cos(a),r*math.sin(a),.18),.026,.006,AMBER,g,12)
 for i in range(36):
  a=math.tau*i/36
  arc('Calibrated position index',r-.036,r+.036,.067,.004,a-.005,a+.005,POL,g,1,.001)

# Merge by material within each mechanical root: meaningful pivots, economical draw calls.
for root in components:
 groups=defaultdict(list)
 for child in list(root.children):
  if child.type=='MESH':groups[child.data.materials[0].name].append(child)
 for mat,objs in groups.items():
  bpy.ops.object.select_all(action='DESELECT')
  for o in objs:o.select_set(True)
  bpy.context.view_layer.objects.active=objs[0];bpy.ops.object.join();o=bpy.context.object;o.name=root.name+'__'+mat.split(' ·')[0].replace(' ','_')
  # Joining keeps the first origin; bake it into mesh for the shared component pivot.
  bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
 bpy.ops.object.select_all(action='DESELECT')
root=bpy.data.objects.new('ELASRAG_Creation_Engine_01',None);bpy.context.collection.objects.link(root);root['license']='Original ELASRAG asset';root['axis']='Z';root['version']='1.0';root['units']='metres';root['design']='Axial optical cartridge with six field stators and two gimbal bearings'
for o in components:o.parent=root
bpy.ops.object.select_all(action='DESELECT');root.select_set(True)
for o in root.children_recursive:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(out,'creation-engine.glb'),export_format='GLB',use_selection=True,export_yup=False,export_extras=True,export_apply=True,export_cameras=False,export_lights=False,export_animations=False)

# Exhibition lighting: large softboxes reflected by all untextured PBR surfaces.
world=bpy.data.worlds.new('Black exhibition');world.use_nodes=True;world.node_tree.nodes['Background'].inputs[0].default_value=(.025,.032,.045,1);world.node_tree.nodes['Background'].inputs[1].default_value=.25;bpy.context.scene.world=world
def point_at(o,p=(0,0,0)):o.rotation_euler=(Vector(p)-o.location).to_track_quat('-Z','Y').to_euler()
def light(name,loc,power,color,size):
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.name=name;o.data.energy=power;o.data.color=color;o.data.shape='DISK';o.data.size=size;point_at(o)
light('Key · tall softbox',(3,-4,7),1600,(.86,.92,1),5)
light('Rim · warm tungsten',(-4,1,3),1800,(1,.86,.64),4)
light('Fill · studio',(1,5,1),2000,(.74,.85,1),3)
light('Top strip',(-1,-1,6),700,(1,1,1),2)
bpy.ops.object.camera_add(location=(6,3.2,7.0));cam=bpy.context.object;point_at(cam);cam.data.type='ORTHO';cam.data.ortho_scale=6.5;bpy.context.scene.camera=cam
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=64;scene.cycles.use_denoising=False;scene.render.resolution_x=1200;scene.render.resolution_y=1200;scene.render.resolution_percentage=100;scene.render.film_transparent=True;scene.view_settings.view_transform='AgX';scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA';scene.render.filepath=os.path.join(out,'engine-poster.png')
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,'engine.blend'),compress=True)
if args.render:bpy.ops.render.render(write_still=True)
print('CREATION_ENGINE_COMPLETE',os.path.join(out,'creation-engine.glb'))
