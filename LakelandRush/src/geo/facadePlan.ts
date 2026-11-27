import type {BuildingFeature,RoadFeature} from '../types/game';
import {pointInRing} from './projection';
import {edgeGrade,type Ground} from './surfaceGround';
import {classifyBuilding,AREAS,inside} from './placeIdentity';
import inventory from '../data/ambleside-business-inventory.json';
import navigation from '../data/ambleside-navigation.json';

export type Family='retail_shopfront'|'hotel_guesthouse'|'lakeland_house'|'civic_public'|'waterside_shop'|'pub_restaurant';
export type Surface='timber'|'glass'|'trim'|'stone'|'awning';
type P=[number,number];
type RecordEntry={name:string;status:string;mapCategory:string;position?:{name:string;x:number;z:number;buildingId?:number;kind:string;travelId?:string}|null};
type Stop={id:string;osmIds:number[];name:string};
export type Edge={x:number;z:number;nx:number;nz:number;length:number;yaw:number;distance:number};
export type Piece={surface:Surface;x:number;y:number;z:number;w:number;h:number;d:number;yaw:number};
export type FacadePlan={family:Family;front:Edge;pieces:Piece[];sign?:{name:string;x:number;y:number;z:number;yaw:number;width:number;height:number}};
const names=(s:string)=>s.trim().toLowerCase().replace(/[^a-z0-9]/g,'');
const ring=(b:BuildingFeature):P[]=>b.pts.map(([x,z])=>[x+b.cx,z+b.cz]);
export const inFacadeArea=(b:BuildingFeature)=>inside(AREAS[0],b.cx,b.cz);
export function mappedIdentity(b:BuildingFeature,records:readonly RecordEntry[]=inventory.records,stops:readonly Stop[]=navigation.stops){
  const matches=records.filter(r=>{
    const p=r.position;
    if(r.status!=='mapped-snapshot-match'||!p||!Number.isFinite(p.x)||!Number.isFinite(p.z))return false;
    if(p.kind==='building'&&p.buildingId===b.id)return Math.hypot(p.x-b.cx,p.z-b.cz)<1;
    if(p.kind==='navigation'&&p.travelId){
      const stop=stops.find(s=>s.id===p.travelId&&names(s.name)===names(p.name));
      return !!stop&&(stop.osmIds.includes(b.id)||p.buildingId===b.id)&&pointInRing(p.x,p.z,ring(b));
    }
    return false;
  });
  return matches.length===1?matches[0]:undefined;
}
export function familyFor(b:BuildingFeature,record?:RecordEntry):Family{
 const cat=record?.mapCategory??classifyBuilding(b);
 if(['hotel','guest_house','hostel'].includes(b.tourism??'')||b.kind==='hotel'||cat==='hotel')return 'hotel_guesthouse';
 if(cat==='food'||['pub','bar','restaurant','cafe','fast_food'].includes(b.amenity??''))return 'pub_restaurant';
 if(b.kind==='boathouse'||(b.cz>-500&&(b.kind==='shop'||cat==='shop'||cat==='attraction')))return 'waterside_shop';
 if(b.kind==='shop'||b.shopType||cat==='shop'||cat==='supermarket')return 'retail_shopfront';
 if(b.kind==='historic'||cat==='service'||cat==='attraction'||['school','library','townhall','place_of_worship','clinic'].includes(b.amenity??''))return 'civic_public';
 return 'lakeland_house';
}
const config:Record<Family,{spacing:number;door:number;window:number;frame:number;fascia:number;shop:boolean}>={
 retail_shopfront:{spacing:2.5,door:1.1,window:1.15,frame:.12,fascia:.42,shop:true},
 hotel_guesthouse:{spacing:2.45,door:1.35,window:1.12,frame:.1,fascia:.36,shop:false},
 lakeland_house:{spacing:2.6,door:.95,window:.95,frame:.085,fascia:0,shop:false},
 civic_public:{spacing:3.2,door:1.4,window:1.3,frame:.12,fascia:.34,shop:false},
 waterside_shop:{spacing:2.4,door:1,window:1.05,frame:.11,fascia:.38,shop:true},
 pub_restaurant:{spacing:2.7,door:1.05,window:1.18,frame:.13,fascia:.4,shop:true},
};
function edges(b:BuildingFeature):Edge[]{
 const r=ring(b);if(r.length<3||r.some(p=>!p.every(Number.isFinite)))return [];
 let area=0;for(let i=0;i<r.length;i++){const a=r[i],c=r[(i+1)%r.length];area+=(a[0]-b.cx)*(c[1]-b.cz)-(c[0]-b.cx)*(a[1]-b.cz);}
 if(Math.abs(area)<.01)return [];
 return r.flatMap((a,i)=>{
   const c=r[(i+1)%r.length],dx=c[0]-a[0],dz=c[1]-a[1],length=Math.hypot(dx,dz);
   if(length<2.15)return [];
   const side=area>0?1:-1,nx=side*dz/length,nz=-side*dx/length;
   return [{x:(a[0]+c[0])/2,z:(a[1]+c[1])/2,nx,nz,length,yaw:Math.atan2(nx,nz),distance:Infinity}];
 });
}
export function chooseFrontage(b:BuildingFeature,roads:readonly RoadFeature[],anchor?:{x:number;z:number}):Edge|null{
 const es=edges(b);let best:Edge|null=null,bestScore=Infinity;
 for(const e of es)for(const r of roads){
   if(!['primary','secondary','lane','footpath'].includes(r.kind))continue;
   for(let j=1;j<r.pts.length;j++){
    const a=r.pts[j-1],c=r.pts[j],dx=c[0]-a[0],dz=c[1]-a[1];
    const t=Math.max(0,Math.min(1,((e.x-a[0])*dx+(e.z-a[1])*dz)/(dx*dx+dz*dz||1)));
    const x=a[0]+t*dx-e.x,z=a[1]+t*dz-e.z,d=Math.hypot(x,z);
    if(d>60||x*e.nx+z*e.nz<.1)continue;
    const score=d+(r.kind==='footpath'?1:0)+Math.max(0,4-e.length);
    if(score<bestScore){best={...e,distance:d};bestScore=score;}
   }
 }
 if(best)return best;
 if(anchor&&Math.hypot(anchor.x-b.cx,anchor.z-b.cz)>.3)return es.sort((a,c)=>Math.hypot(a.x-anchor.x,a.z-anchor.z)-Math.hypot(c.x-anchor.x,c.z-anchor.z)||c.length-a.length)[0]??null;
 return es.sort((a,c)=>c.length-a.length)[0]??null;
}
export function planFacade(b:BuildingFeature,roads:readonly RoadFeature[],ground:number,wallH:number,neighbors:readonly BuildingFeature[]=[],records:readonly RecordEntry[]=inventory.records,surfaceGround?:Ground):FacadePlan|null{
 if(!Number.isFinite(ground)||!Number.isFinite(wallH)||wallH<2.5)return null;
 const record=mappedIdentity(b,records),family=familyFor(b,record),cfg=config[family];
 let front=chooseFrontage(b,roads,record?.position??undefined);
 if(!front)return null;
 const top=ground+wallH;
 if(record?.position?.kind==='navigation'){
   const anchor=record.position;
   const facing=edges(b).filter(e=>roads.some(r=>['primary','secondary','lane','footpath'].includes(r.kind)&&r.pts.slice(1).some((q,i)=>{const a=r.pts[i],dx=q[0]-a[0],dz=q[1]-a[1],t=Math.max(0,Math.min(1,((e.x-a[0])*dx+(e.z-a[1])*dz)/(dx*dx+dz*dz||1))),x=a[0]+dx*t-e.x,z=a[1]+dz*t-e.z;return Math.hypot(x,z)<25&&x*e.nx+z*e.nz>1;})));
   front=facing.sort((a,c)=>Math.hypot(a.x-anchor.x,a.z-anchor.z)-Math.hypot(c.x-anchor.x,c.z-anchor.z))[0]??front;
   if(front.length>8){const tx=Math.cos(front.yaw),tz=-Math.sin(front.yaw),offset=Math.max(-front.length/2+4,Math.min(front.length/2-4,(anchor.x-front.x)*tx+(anchor.z-front.z)*tz));front={...front,x:front.x+tx*offset,z:front.z+tz*offset,length:8};}
 }
 const localGrade=(edge:Edge,u=0,width=.4)=>surfaceGround?edgeGrade(edge.x+Math.cos(edge.yaw)*u,edge.z-Math.sin(edge.yaw)*u,edge.nx,edge.nz,width,edge.yaw,surfaceGround):ground;
 ground=localGrade(front,0,Math.min(front.length,2));wallH=top-ground;
 if(wallH<2.5)return null;
 const pieces:Piece[]=[];
 const usable=front.length-.65, doorW=Math.min(cfg.door,usable*.5),doorH=Math.min(2.15,wallH-.9);
 const put=(e:Edge,surface:Surface,u:number,y:number,w:number,h:number,d:number,offset:number)=>{
   if(w<.035||h<.035||pieces.length>=180)return;
   const gx=e.x+Math.cos(e.yaw)*u+e.nx*offset,gz=e.z-Math.sin(e.yaw)*u+e.nz*offset;
   if(surfaceGround&&ground+y+h/2<surfaceGround(gx,gz)+.05)return;
   pieces.push({surface,x:e.x+Math.cos(e.yaw)*u+e.nx*offset,y:ground+y,z:e.z-Math.sin(e.yaw)*u+e.nz*offset,w,h,d,yaw:e.yaw});
 };
 const frame=(e:Edge,u:number,y:number,w:number,h:number,display=false)=>{
   const t=Math.min(cfg.frame,w*.12);
   put(e,'glass',u,y,w-2*t,h-2*t,.035,.035);
   for(const side of [-1,1])put(e,'trim',u+side*(w-t)/2,y,t,h,.14,.09);
   for(const side of [-1,1])put(e,'trim',u,y+side*(h-t)/2,w,t,.14,.09);
   put(e,'stone',u,y-h/2-.045,w+.12,.09,.23,.105);
   if(display||w>1)put(e,'timber',u,y,.065,h-2*t,.11,.075);
   if(!display)put(e,'trim',u,y+.08,w-2*t,.055,.11,.08);
 };
 // Door panel sits in front of original solid wall; surrounding frame projects farther.
 put(front,'timber',0,doorH/2,doorW,doorH,.06,.045);
 for(const side of [-1,1])put(front,'trim',side*(doorW/2+.055),doorH/2,.11,doorH+.08,.15,.10);
 put(front,'trim',0,doorH+.045,doorW+.22,.09,.15,.10);
 put(front,'glass',0,doorH*.70,doorW*.66,doorH*.38,.04,.085);
 put(front,'trim',doorW*.30,doorH*.45,.045,.13,.08,.12);
 const fasciaY=cfg.shop?Math.min(wallH-.27,doorH+.35):Math.min(wallH-.28,doorH+.27);
 const fasciaWidth=cfg.shop?usable:Math.min(usable,4.2);
 if(cfg.shop){
   const sideW=(usable-doorW-.42)/2;
   if(sideW>.60)for(const s of [-1,1]){
      const u=s*(doorW/2+.21+sideW/2),h=Math.min(1.62,doorH-.25);
      put(front,'timber',u,.23,sideW,.46,.10,.06);
      frame(front,u,.47+h/2,sideW,h,true);
   }
 }else{
   const sideW=(usable-doorW-.65)/2;
   if(sideW>.70)for(const s of [-1,1])frame(front,s*(doorW/2+.32+sideW/2),Math.min(1.55,doorH*.74),Math.min(cfg.window,sideW),Math.min(1.25,doorH*.62));
 }
 if(cfg.fascia>0)put(front,'trim',0,fasciaY,fasciaWidth,cfg.fascia,.045,.025);
 if(!cfg.shop&&front.length>9)for(let u=-usable/2+1.1;u<usable/2-1;u+=4.5){if(Math.abs(u)<1.8)continue;const y=localGrade(front,u,1)-ground;put(front,'timber',u,y+1.02,.92,2.04,.07,.07);put(front,'trim',u,y+2.09,1.08,.11,.16,.1);for(const s of [-1,1])put(front,'trim',u+s*.49,y+1.02,.1,2.04,.15,.1);}
 // Deterministic awning on selected wide retail frontages, only with clear forecourt.
 if(cfg.shop&&b.id%5===0&&usable>4.5&&front.distance>5&&front.distance<50&&wallH>3){
   const clear=[-.42,0,.42].every(f=>[.2,.65,1.1].every(d=>!neighbors.some(other=>other.id!==b.id&&pointInRing(front.x+Math.cos(front.yaw)*usable*f+front.nx*d,front.z-Math.sin(front.yaw)*usable*f+front.nz*d,ring(other)))));
   if(clear)put(front,'awning',0,doorH+.12,Math.min(usable,5.5),.10,.85,.47);
 }
 const floors=Math.min(4,Math.max(1,Math.min(b.levels??Math.round(wallH/2.8),Math.floor(wallH/2.35))));
 const upper=Math.max(0,floors-1);
 for(const e of [front,...edges(b).filter(e=>Math.hypot(e.x-front.x,e.z-front.z)>.15&&e.length>=3.2).sort((a,c)=>c.length-a.length).slice(0,2)]){
   const n=Math.min(7,Math.max(1,Math.floor((e.length-.6)/cfg.spacing))),spacing=(e.length-.6)/n;
   for(let f=0;f<upper;f++){
     const floorStart=Math.max(2.65,fasciaY+.35),storey=(wallH-floorStart)/upper;
     if(storey<.65)continue;
     const h=Math.min(1.45,storey*.65),y=floorStart+(f+.5)*storey;
     for(let k=0;k<n;k++)frame(e,(k-(n-1)/2)*spacing,y,Math.min(cfg.window,spacing*.65),h);
   }
   if(e!==front&&wallH>=2.6)for(let k=0;k<n;k++){const u=(k-(n-1)/2)*spacing,y=localGrade(e,u,Math.min(cfg.window,spacing*.65))-ground; if(ground+y+2.1<top)frame(e,u,y+1.5,Math.min(cfg.window,spacing*.65),1.15);}
 }
 const name=record?.name??(b.name&&classifyBuilding(b)&&!records.some(r=>names(r.name)===names(b.name!))?b.name:undefined);
 const sign=name&&cfg.fascia>0?{name,x:front.x+front.nx*.052,y:ground+fasciaY,z:front.z+front.nz*.052,yaw:front.yaw,width:Math.min(6,fasciaWidth-.12),height:cfg.fascia-.055}:undefined;
 return {family,front,pieces,sign};
}
