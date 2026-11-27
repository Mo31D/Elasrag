import * as THREE from 'three';
// A fixed pool of short-lived surface ripples; no per-frame mesh allocation.
export class WaterRipples {
 private geometry=new THREE.RingGeometry(.83,1,32);
 private slots:Array<{mesh:THREE.Mesh<THREE.RingGeometry,THREE.MeshBasicMaterial>;age:number;life:number;radius:number;stretch:number}>=[];
 private cursor=0;
 constructor(private scene:THREE.Scene){
  for(let i=0;i<24;i++){
   const mesh=new THREE.Mesh(this.geometry,new THREE.MeshBasicMaterial({color:0xd6eff0,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-1}));
   mesh.rotation.x=-Math.PI/2;mesh.visible=false;scene.add(mesh);this.slots.push({mesh,age:0,life:1,radius:1,stretch:1});
  }
 }
 emit(x:number,z:number,radius:number,stretch=1,yaw=0){
  const p=this.slots[this.cursor++%this.slots.length];p.age=0;p.life=1.3;p.radius=radius;p.stretch=stretch;
  p.mesh.position.set(x,.035,z);p.mesh.rotation.set(-Math.PI/2,0,yaw);p.mesh.scale.set(radius*.28,radius*.28*stretch,1);p.mesh.material.opacity=.32;p.mesh.visible=true;
 }
 update(dt:number){
  for(const p of this.slots){if(!p.mesh.visible)continue;p.age+=dt;const t=p.age/p.life;if(t>=1){p.mesh.visible=false;continue;}
   const size=p.radius*(.28+t);p.mesh.scale.set(size,size*p.stretch,1);p.mesh.material.opacity=.32*(1-t)*(1-t);
  }
 }
 dispose(){for(const p of this.slots){this.scene.remove(p.mesh);p.mesh.material.dispose();}this.geometry.dispose();}
}
