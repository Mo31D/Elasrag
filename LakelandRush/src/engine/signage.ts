import * as THREE from 'three';
import type { LakeData, TerrainGridData, WorldChunkData } from '../types/game';
import { isPointInLake, sampleTerrainHeight } from '../geo/projection';
import { planRoadSigns,frontageAnchor,approachAnchor } from '../geo/signagePlan';
import { classifyBuilding } from '../geo/placeIdentity';
import type { FacadePlan } from '../geo/facadePlan';
import buildingAssets from '../data/building-assets.json';
import { TRANSIT } from '../data/transit';
import navigation from '../data/ambleside-navigation.json';
import inventory from '../data/ambleside-business-inventory.json';

export function buildSignage(chunk:WorldChunkData,terrain:TerrainGridData|null,lake:LakeData|null, facadePlans:ReadonlyMap<number,FacadePlan>=new Map()) {
  const group=new THREE.Group();
  group.name='World signage and place identities';
  const geometries:THREE.BufferGeometry[]=[];
  const materials:THREE.Material[]=[];
  const textures:THREE.Texture[]=[];
  const boards:THREE.Group[]=[];
  const plaques:THREE.Mesh[]=[];
  const assetIds=new Set(buildingAssets.map(b=>b.buildingId));
  const labels:THREE.Sprite[]=[];
  const postMat=new THREE.MeshStandardMaterial({color:0x777f80,roughness:.7,metalness:.3});
  materials.push(postMat);
  const ground=(x:number,z:number)=>Math.max(.45,sampleTerrainHeight(terrain,x,z));
  function artwork(lines:string[],style:'road'|'street'|'bus'|'rail'|'label'|'welcome'|'direction'|'facade') {
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=lines.length>1?192:112;
    const ctx=canvas.getContext('2d')!;
    const bg=style==='direction'||style==='road'?'#087044':style==='welcome'?'#79512c':style==='facade'?'#25352f':style==='bus'?'#f3f5f4':style==='rail'?'#263d70':style==='label'?'#182a31':'#f4f3e9';
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
  function board(x:number,z:number,yaw:number,lines:string[],style:'road'|'street'|'bus'|'rail'|'welcome'|'direction',id:string,oneSided=false) {
    const {texture,ratio}=artwork(lines,style);
    const w=style==='bus'?1.05:style==='street'?1.45:style==='direction'?2.8:style==='welcome'?2.4:2.05,h=w*ratio;
    const postH=style==='street'?1.15:2.05;
    const root=new THREE.Group();root.position.set(x,ground(x,z),z);root.rotation.y=yaw;root.name=id;
    const pole=new THREE.CylinderGeometry(.045,.055,postH,8);geometries.push(pole);
    const p=new THREE.Mesh(pole,postMat);p.position.y=postH/2;root.add(p);
    const geom=new THREE.PlaneGeometry(w,h);geometries.push(geom);
    const mat=new THREE.MeshBasicMaterial({map:texture,toneMapped:false});materials.push(mat);
    for(const side of oneSided?[1]:[-1,1]) {
      const face=new THREE.Mesh(geom,mat);face.position.set(0,postH,side*.035);face.rotation.y=side===1?0:Math.PI;root.add(face);
    }
    const backing=new THREE.BoxGeometry(w,h,.055);geometries.push(backing);
    const back=new THREE.Mesh(backing,postMat);back.position.y=postH;root.add(back);
    root.visible=false;boards.push(root);group.add(root);
  }
  const roadSigns=planRoadSigns(chunk,(x,z)=>isPointInLake(lake,x,z));
  for(const s of roadSigns) {
    const ref=s.ref&&s.ref!==s.name?s.ref:undefined;
    const welcome=chunk.key==='0_-1'&&s.ref==='A591'?'Ambleside':chunk.key==='7_8'&&(s.name==='A591'||s.ref==='A591')?'Windermere':null;
    // Illustrative welcome plates, not surveyed boundary signs. Preserve road identity on second line.
    if(welcome)board(s.x,s.z,s.yaw,['Welcome to '+welcome,ref||s.name],'welcome',s.id+'-welcome');
    else board(s.x,s.z,s.yaw,ref?[s.name,ref]:[s.name],s.ref?'road':'street',s.id);
  }
  const inChunk=(x:number,z:number)=>Math.floor(x/500)===chunk.cx&&Math.floor(z/500)===chunk.cz;
  for(const t of TRANSIT)if(inChunk(t.x,t.z)&&!isPointInLake(lake,t.x,t.z)){
    board(t.x,t.z,t.bearing*Math.PI/180,[t.mode==='bus'?'BUS STOP':'RAILWAY',t.name],t.mode,t.id);
  }
  if(chunk.key==='0_-1'){
    const approach=navigation.arcade;
    const fork=navigation.approaches.find(a=>a.id==='east')?.points[0];
    const i=approach.findIndex(pt=>fork&&pt[0]===fork[0]&&pt[1]===fork[1]);
    if(i>1){
      const anchor=approachAnchor(chunk,approach[i-1] as [number,number],approach[i] as [number,number],(x,z)=>isPointInLake(lake,x,z));
      if(anchor&&!roadSigns.some(s=>Math.hypot(s.x-anchor.x,s.z-anchor.z)<5)){
        board(anchor.x,anchor.z,anchor.yaw,['↑ Lake Road A591','← Borrans Road A5075'],'direction','waterhead-approach-directions',true);
      }
    }
  }
  // Original text-only frontage plaques on approximate public/commercial building geometry.
  // Do not alter custom authored landmark models.
  const frontageBuildings=chunk.buildings.filter(b=>!facadePlans.has(b.id)&&['shop','food','hotel','fuel','supermarket','rail'].includes(classifyBuilding(b)||'')&&!assetIds.has(b.id)&&inChunk(b.cx,b.cz)).slice(0,70);
  for(const b of frontageBuildings){
    const anchor=frontageAnchor(b,chunk.roads);
    if(!anchor||!b.name)continue;
    const {texture,ratio}=artwork([b.name],'facade');
    const geom=new THREE.PlaneGeometry(anchor.width,Math.min(.65,anchor.width*ratio));geometries.push(geom);
    const mat=new THREE.MeshBasicMaterial({map:texture,toneMapped:false});materials.push(mat);
    const mesh=new THREE.Mesh(geom,mat);mesh.position.set(anchor.x,ground(b.cx,b.cz)+Math.min(2.55,Math.max(1.5,b.h-2.1)),anchor.z);
    mesh.rotation.y=anchor.yaw;mesh.name='frontage-'+b.id;mesh.visible=false;plaques.push(mesh);group.add(mesh);
  }
  for(const [id,plan] of facadePlans){
    const a=plan.sign;if(!a||a.width<.3||a.height<.15)continue;
    const {texture}=artwork([a.name],'facade');
    const geom=new THREE.PlaneGeometry(a.width,a.height);geometries.push(geom);
    const mat=new THREE.MeshBasicMaterial({map:texture,toneMapped:false});materials.push(mat);
    const mesh=new THREE.Mesh(geom,mat);mesh.position.set(a.x,a.y,a.z);mesh.rotation.y=a.yaw;
    mesh.name='facade-sign-'+id;mesh.visible=false;plaques.push(mesh);group.add(mesh);
  }
  function label(name:string,x:number,z:number,height:number) {
    const {texture,ratio}=artwork([name],'label');
    const mat=new THREE.SpriteMaterial({map:texture,depthTest:true,depthWrite:false,toneMapped:false});materials.push(mat);
    const sprite=new THREE.Sprite(mat);sprite.position.set(x,ground(x,z)+height,z);
    const w=Math.max(2.8,Math.min(7,name.length*.23));sprite.scale.set(w,w*ratio,1);sprite.visible=false;
    labels.push(sprite);group.add(sprite);
  }
  const names=new Set<string>();
  const mapped=inventory.records.filter(r=>r.position&&inChunk(r.position.x,r.position.z));
  for(const stop of navigation.stops)if(inChunk(...(stop.point as [number,number]))&&stop.kind!=='junction'){
    const [x,z]=stop.point;
    const business=mapped.find(r=>r.position?.name===stop.name&&Math.hypot(r.position.x-x,r.position.z-z)<1);
    const name=business?.name??stop.name;
    label(name,x,z,3.2);names.add(name.toLowerCase());names.add(stop.name.toLowerCase());
  }
  // Imported identities use existing map feature coordinates only, never street-centroid guesses.
  for(const r of mapped){
    const p=r.position;
    if(!p||names.has(r.name.toLowerCase())||isPointInLake(lake,p.x,p.z))continue;
    const b=chunk.buildings.find(b=>b.name===p.name&&Math.hypot(b.cx-p.x,b.cz-p.z)<45);
    label(r.name,p.x,p.z,b?Math.max(3.5,b.h+.5):3.2);
    names.add(r.name.toLowerCase());names.add(p.name.toLowerCase());
  }
  for(const b of chunk.buildings) {
    if(!b.name||names.has(b.name.toLowerCase())||!inChunk(b.cx,b.cz))continue;
    // Avoid labelling private cottages by default.
    if(!classifyBuilding(b)&&!(/zeffirellis|yha|kayak hire/i.test(b.name)))continue;
    label(b.name,b.cx,b.cz,Math.max(3.5,b.h+.5));names.add(b.name.toLowerCase());
    if(labels.length>=24)break;
  }
  for(const poi of chunk.pois??[])if(inChunk(poi.x,poi.z)&&!names.has(poi.name.toLowerCase())&&labels.length<24){
    label(poi.name,poi.x,poi.z,3.2);names.add(poi.name.toLowerCase());
  }
  return {group, update(x:number,z:number,showLabels:boolean) {
    for(const b of boards)b.visible=Math.hypot(b.position.x-x,b.position.z-z)<110;
    for(const plaque of plaques)plaque.visible=Math.hypot(plaque.position.x-x,plaque.position.z-z)<55;
    const nearby=labels.map(l=>({l,d:Math.hypot(l.position.x-x,l.position.z-z)})).filter(v=>v.d<45).sort((a,b)=>a.d-b.d).slice(0,3);
    const visible=new Set(nearby.map(v=>v.l));
    for(const l of labels)l.visible=showLabels&&visible.has(l);
  },dispose() {
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());
  }};
}
