import type { BuildingFeature, WorldChunkData } from '../types/game';
export type PlaceCategory='shop'|'hotel'|'food'|'fuel'|'supermarket'|'attraction'|'service'|'rail'|'bus';
export const CATEGORY_NAMES:Record<PlaceCategory,string>={shop:'Shops',hotel:'Hotels & stays',food:'Food & drink',fuel:'Fuel',supermarket:'Supermarkets',attraction:'Attractions',service:'Services',rail:'Rail stations',bus:'Bus stops'};
export function classifyBuilding(b:BuildingFeature):PlaceCategory|null {
  if(!b.name?.trim())return null;
  const n=b.name;
  if(/railway station/i.test(n))return 'rail';
  if(/petrol station|filling station|service station/i.test(n)||b.amenity==='fuel')return 'fuel';
  if(/\b(booths|tesco|co-op|sainsbury|spar|aldi|lidl|supermarket)\b/i.test(n)||b.shopType==='supermarket')return 'supermarket';
  if(b.kind==='hotel'||/\b(hotel|guest house|hostel|bed & breakfast|inn)\b/i.test(n)||['hotel','guest_house','hostel'].includes(b.tourism||''))return 'hotel';
  if(/\b(cafe|café|coffee|restaurant|bistro|pizza|pizzeria|pub|tap yard|tap room|bakery|chippy|grill|burger|ice cream|tearooms?)\b/i.test(n)||['cafe','restaurant','pub','fast_food','bar'].includes(b.amenity||''))return 'food';
  if(b.kind==='historic'||/museum|attraction|bridge house|market cross|roman fort|\bpier\b|church|cinema|theatre/i.test(n)||b.tourism==='attraction')return 'attraction';
  if(/library|post office|fire station|health centre|car park|surgery|rescue base/i.test(n))return 'service';
  if(b.kind==='shop'||b.shopType)return 'shop';
  return null;
}
export const AREAS=[
  {id:'ambleside',name:'Ambleside & Waterhead',minX:-600,maxX:650,minZ:-2000,maxZ:100},
  {id:'windermere',name:'Windermere',minX:3000,maxX:4500,minZ:3600,maxZ:5100},
  {id:'bowness',name:'Bowness-on-Windermere',minX:2300,maxX:3500,minZ:5200,maxZ:6500},
];
export type Area=typeof AREAS[number];
export type PlaceEntry={id:string;name:string;category:PlaceCategory;x:number;z:number;source:string;travelId?:string;buildingId?:number};
export function inside(a:Area,x:number,z:number){return x>=a.minX&&x<=a.maxX&&z>=a.minZ&&z<=a.maxZ;}
export function areaChunkKeys(a:Area,keys:string[],size:number) {
  return keys.filter(k=>{const [x,z]=k.split('_').map(Number);return x*size<a.maxX&&(x+1)*size>a.minX&&z*size<a.maxZ&&(z+1)*size>a.minZ;});
}
export function indexPlaces(a:Area,chunks:WorldChunkData[]):PlaceEntry[]{
  const places=new Map<string,PlaceEntry>();
  for(const c of chunks){
    for(const b of c.buildings){const category=classifyBuilding(b);if(category&&b.name&&inside(a,b.cx,b.cz))places.set('building-'+b.id,{id:'building-'+b.id,name:b.name,category,x:b.cx,z:b.cz,buildingId:b.id,source:'OSM way '+b.id});}
    for(const p of c.pois??[]){if(!inside(a,p.x,p.z)||!p.name)continue;
      if([...places.values()].some(b=>b.name.toLowerCase()===p.name.toLowerCase()&&Math.hypot(b.x-p.x,b.z-p.z)<40))continue;
      const category:PlaceCategory=p.category==='hotel'?'hotel':['cafe','pub','restaurant','bakery'].includes(p.category)?'food':p.category==='shop'?'shop':['attraction','historic','outdoor'].includes(p.category)?'attraction':'service';
      places.set('poi-'+p.id,{id:'poi-'+p.id,name:p.name,category,x:p.x,z:p.z,source:'Existing OSM-derived POI '+p.id,buildingId:p.buildingId});
    }
  }
  return [...places.values()];
}
