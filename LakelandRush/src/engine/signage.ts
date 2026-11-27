import * as THREE from 'three';
import type { LakeData, TerrainGridData, WorldChunkData } from '../types/game';
import { isPointInLake, sampleTerrainHeight } from '../geo/projection';
import { planRoadSigns,frontageAnchor,approachAnchor,transitAnchor,boardWidth } from '../geo/signagePlan';
import { classifyBuilding } from '../geo/placeIdentity';
import {boardFaces} from '../geo/roadPresentation';
import type { FacadePlan } from '../geo/facadePlan';
import buildingAssets from '../data/building-assets.json';
import { TRANSIT } from '../data/transit';
import navigation from '../data/ambleside-navigation.json';

export function buildSignage(chunk:WorldChunkData,terrain:TerrainGridData|null,lake:LakeData|null, facadePlans:ReadonlyMap<number,FacadePlan>=new Map(),customIds:ReadonlySet<number>=new Set()) {
  const group=new THREE.Group();
  group.name='World signage and place identities';
  const geometries:THREE.BufferGeometry[]=[];
  const materials:THREE.Material[]=[];
  const textures:THREE.Texture[]=[];
  const boards:THREE.Group[]=[];
  const plaques:THREE.Mesh[]=[];
  const assetIds=new Set(buildingAssets.map(b=>b.buildingId));
  const postMat=new THREE.MeshStandardMaterial({color:0x777f80,roughness:.7,metalness:.3});
  materials.push(postMat);
  const ground=(x:number,z:number)=>Math.max(.45,sampleTerrainHeight(terrain,x,z));
  function artwork(lines:string[],style:'road'|'street'|'bus'|'rail'|'welcome'|'direction'|'facade') {
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=lines.length>1?192:112;
    const ctx=canvas.getContext('2d')!;
    const bg=style==='direction'||style==='road'?'#087044':style==='welcome'?'#79512c':style==='facade'?'#e7dfc9':style==='bus'?'#f3f5f4':style==='rail'?'#263d70':'#f4f3e9';
    ctx.fillStyle=bg;ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle=style==='street'||style==='bus'?'#182425':'#f4f5ef';ctx.lineWidth=7;
    if(style!=='facade')ctx.strokeRect(7,7,canvas.width-14,canvas.height-14);
    ctx.textAlign='center';ctx.textBaseline='middle';
    lines.forEach((line,i)=>{
      let size=lines.length>1?53:62;
      do{ctx.font='600 '+size+'px Arial, sans-serif';if(ctx.measureText(line).width<=474||size<=14)break;size--;}while(true);
      ctx.fillStyle=style==='road'&&i===1?'#f8cf44':style==='street'||style==='bus'||style==='facade'?'#273a35':'#ffffff';
      ctx.fillText(line,256,canvas.height*(i+.5)/lines.length);
    });
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;textures.push(texture);
    return {texture,ratio:canvas.height/canvas.width};
  }
  function board(x:number,z:number,yaw:number,lines:string[],style:'road'|'street'|'bus'|'rail'|'welcome'|'direction',id:string,directional=false) {
    const {texture,ratio}=artwork(lines,style);
    const w=boardWidth(style),h=w*ratio;
    const postH=style==='street'?1.15:2.05;
    const root=new THREE.Group();root.position.set(x,ground(x,z),z);root.rotation.y=yaw;root.name=id;
    const pole=new THREE.CylinderGeometry(.045,.055,postH,8);geometries.push(pole);
    const p=new THREE.Mesh(pole,postMat);p.position.y=postH/2;root.add(p);
    const geom=new THREE.PlaneGeometry(w,h);geometries.push(geom);
    const mat=new THREE.MeshBasicMaterial({map:texture,toneMapped:false});materials.push(mat);
    for(const side of boardFaces(directional)) {
      // A separate front-facing plane per side avoids mirrored lettering.
      // Reverse of a directional board carries route names, not incorrect mirrored arrows.
      const reverse=side.reverse?artwork(lines.map(l=>l.replace(/^[↑←→↓]\s*/,'')),style).texture:null;
      const faceMat=reverse?new THREE.MeshBasicMaterial({map:reverse,toneMapped:false}):mat;
      if(reverse)materials.push(faceMat);
      const face=new THREE.Mesh(geom,faceMat);face.position.set(0,postH,side.side*.035);face.rotation.y=side.yaw;root.add(face);
    }
    const backing=new THREE.BoxGeometry(w,h,.055);geometries.push(backing);
    const back=new THREE.Mesh(backing,postMat);back.position.y=postH;root.add(back);
    root.visible=false;boards.push(root);group.add(root);
  }
  const roadSigns=planRoadSigns(chunk,(x,z)=>isPointInLake(lake,x,z));
  for(const s of roadSigns) {
    const ref=s.ref&&s.ref!==s.name?s.ref:undefined;
    // Do not fabricate welcome/boundary boards from ordinary road IDs.
    board(s.x,s.z,s.yaw,ref?[s.name,ref]:[s.name],s.ref?'road':'street',s.id);
  }
  const inChunk=(x:number,z:number)=>Math.floor(x/500)===chunk.cx&&Math.floor(z/500)===chunk.cz;
  for(const t of TRANSIT)if(inChunk(t.x,t.z)&&!isPointInLake(lake,t.x,t.z)){
    const a=transitAnchor(chunk,t,(x,z)=>isPointInLake(lake,x,z));
    if(a&&!roadSigns.some(s=>Math.hypot(s.x-a.x,s.z-a.z)<2))board(a.x,a.z,a.yaw,[t.mode==='bus'?'BUS STOP':'RAILWAY',t.name],t.mode,t.id);
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
  const frontageBuildings=chunk.buildings.filter(b=>!customIds.has(b.id)&&!facadePlans.has(b.id)&&['shop','food','hotel','fuel','supermarket','rail'].includes(classifyBuilding(b)||'')&&!assetIds.has(b.id)&&inChunk(b.cx,b.cz)).slice(0,70);
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
  // No floating business billboards: names belong on physical facades, the HUD and searchable map.
  return {group, update(x:number,z:number,_showLabels:boolean) {
    for(const b of boards)b.visible=Math.hypot(b.position.x-x,b.position.z-z)<110;
    for(const plaque of plaques)plaque.visible=Math.hypot(plaque.position.x-x,plaque.position.z-z)<95;
  },dispose() {
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());
  }};
}
