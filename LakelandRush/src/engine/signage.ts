import * as THREE from 'three';
import type { LakeData, TerrainGridData, WorldChunkData } from '../types/game';
import { isPointInLake, sampleTerrainHeight } from '../geo/projection';
import { planRoadSigns } from '../geo/signagePlan';
import { TRANSIT } from '../data/transit';
import navigation from '../data/ambleside-navigation.json';

export function buildSignage(chunk:WorldChunkData,terrain:TerrainGridData|null,lake:LakeData|null) {
  const group=new THREE.Group();
  group.name='World signage and place identities';
  const geometries:THREE.BufferGeometry[]=[];
  const materials:THREE.Material[]=[];
  const textures:THREE.Texture[]=[];
  const boards:THREE.Group[]=[];
  const labels:THREE.Sprite[]=[];
  const postMat=new THREE.MeshStandardMaterial({color:0x777f80,roughness:.7,metalness:.3});
  materials.push(postMat);
  const ground=(x:number,z:number)=>Math.max(.45,sampleTerrainHeight(terrain,x,z));
  function artwork(lines:string[],style:'road'|'street'|'bus'|'rail'|'label') {
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=lines.length>1?192:112;
    const ctx=canvas.getContext('2d')!;
    const bg=style==='road'?'#087044':style==='bus'?'#f3f5f4':style==='rail'?'#263d70':style==='label'?'#182a31':'#f4f3e9';
    ctx.fillStyle=bg;ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle=style==='street'||style==='bus'?'#182425':'#f4f5ef';ctx.lineWidth=7;
    ctx.strokeRect(7,7,canvas.width-14,canvas.height-14);
    ctx.textAlign='center';ctx.textBaseline='middle';
    lines.forEach((line,i)=>{
      let size=lines.length>1?53:62;
      do{ctx.font='600 '+size+'px Arial, sans-serif';if(ctx.measureText(line).width<=474||size<=14)break;size--;}while(true);
      ctx.fillStyle=style==='road'&&i===1?'#f8cf44':style==='street'||style==='bus'?'#182425':'#ffffff';
      ctx.fillText(line,256,canvas.height*(i+.5)/lines.length);
    });
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;textures.push(texture);
    return {texture,ratio:canvas.height/canvas.width};
  }
  function board(x:number,z:number,yaw:number,lines:string[],style:'road'|'street'|'bus'|'rail',id:string) {
    const {texture,ratio}=artwork(lines,style);
    const w=style==='bus'?1.05:style==='street'?1.45:2.05,h=w*ratio;
    const postH=style==='street'?1.15:2.05;
    const root=new THREE.Group();root.position.set(x,ground(x,z),z);root.rotation.y=yaw;root.name=id;
    const pole=new THREE.CylinderGeometry(.045,.055,postH,8);geometries.push(pole);
    const p=new THREE.Mesh(pole,postMat);p.position.y=postH/2;root.add(p);
    const geom=new THREE.PlaneGeometry(w,h);geometries.push(geom);
    const mat=new THREE.MeshBasicMaterial({map:texture,toneMapped:false});materials.push(mat);
    for(const side of [-1,1]) {
      const face=new THREE.Mesh(geom,mat);face.position.set(0,postH,side*.035);face.rotation.y=side===1?0:Math.PI;root.add(face);
    }
    const backing=new THREE.BoxGeometry(w,h,.055);geometries.push(backing);
    const back=new THREE.Mesh(backing,postMat);back.position.y=postH;root.add(back);
    root.visible=false;boards.push(root);group.add(root);
  }
  for(const s of planRoadSigns(chunk,(x,z)=>isPointInLake(lake,x,z))) {
    const ref=s.ref&&s.ref!==s.name?s.ref:undefined;
    board(s.x,s.z,s.yaw,ref?[s.name,ref]:[s.name],s.ref?'road':'street',s.id);
  }
  const inChunk=(x:number,z:number)=>Math.floor(x/500)===chunk.cx&&Math.floor(z/500)===chunk.cz;
  for(const t of TRANSIT)if(inChunk(t.x,t.z)&&!isPointInLake(lake,t.x,t.z)){
    board(t.x,t.z,t.bearing*Math.PI/180,[t.mode==='bus'?'BUS STOP':'RAILWAY',t.name],t.mode,t.id);
  }
  function label(name:string,x:number,z:number,height:number) {
    const {texture,ratio}=artwork([name],'label');
    const mat=new THREE.SpriteMaterial({map:texture,depthTest:true,depthWrite:false,toneMapped:false});materials.push(mat);
    const sprite=new THREE.Sprite(mat);sprite.position.set(x,ground(x,z)+height,z);
    const w=Math.max(2.8,Math.min(7,name.length*.23));sprite.scale.set(w,w*ratio,1);sprite.visible=false;
    labels.push(sprite);group.add(sprite);
  }
  const names=new Set<string>();
  for(const stop of navigation.stops)if(inChunk(...(stop.point as [number,number]))&&stop.kind!=='junction'){
    const [x,z]=stop.point;label(stop.name,x,z,3.2);names.add(stop.name.toLowerCase());
  }
  for(const b of chunk.buildings) {
    if(!b.name||names.has(b.name.toLowerCase())||!inChunk(b.cx,b.cz))continue;
    // Avoid labelling private cottages by default.
    if(!['hotel','shop','historic'].includes(b.kind)&&!(/museum|library|restaurant|pizza|cafe|coffee|station|inn\b|pub\b|church|centre|pier|hire|bridge house|zeffirellis|yha/i.test(b.name)))continue;
    label(b.name,b.cx,b.cz,Math.max(3.5,b.h+.5));names.add(b.name.toLowerCase());
    if(labels.length>=24)break;
  }
  for(const poi of chunk.pois??[])if(inChunk(poi.x,poi.z)&&!names.has(poi.name.toLowerCase())&&labels.length<24){
    label(poi.name,poi.x,poi.z,3.2);names.add(poi.name.toLowerCase());
  }
  return {group, update(x:number,z:number,showLabels:boolean) {
    for(const b of boards)b.visible=Math.hypot(b.position.x-x,b.position.z-z)<110;
    const nearby=labels.map(l=>({l,d:Math.hypot(l.position.x-x,l.position.z-z)})).filter(v=>v.d<45).sort((a,b)=>a.d-b.d).slice(0,3);
    const visible=new Set(nearby.map(v=>v.l));
    for(const l of labels)l.visible=showLabels&&visible.has(l);
  },dispose() {
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());
  }};
}
