import {readFileSync,readdirSync} from 'node:fs';
const data=new URL('../public/regions/windermere/chunks/',import.meta.url);
const nav=JSON.parse(readFileSync(new URL('../src/data/ambleside-navigation.json',import.meta.url),'utf8'));
const roadKinds=new Set(['primary','secondary','lane','footpath']);
const special={561321008:1.8,561321009:3,4600162:2.9,4600163:2.9};
const width=r=>r.widthM>0?r.widthM/2:special[r.id]??(r.kind==='primary'?4.4:r.kind==='secondary'?3.4:r.kind==='lane'?2.6:r.sidewalk?.85:1.35);
const len=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const key=p=>p.map(x=>Math.round(x*10)).join(',');
const distSeg=(p,a,b)=>{const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dz)/(dx*dx+dz*dz||1)));return len(p,[a[0]+t*dx,a[1]+t*dz]);};
export function generateSprintNetwork(){
 const ways=new Map(),nodes=new Map(),adj=new Map(),edges=[],buckets=new Map();
 for(const filename of readdirSync(data).filter(x=>x.endsWith('.json')).sort()){
  const chunk=JSON.parse(readFileSync(new URL(filename,data),'utf8'));
  for(const r of chunk.roads??[])if(roadKinds.has(r.kind)&&r.pts.length>1)ways.set(r.id+':'+JSON.stringify(r.pts),r);
 }
 function add(a,b,r){
  const u=key(a),v=key(b),d=len(a,b);if(u===v||d<.05)return;
  nodes.set(u,a);nodes.set(v,b);
  const e={a,b,r,d};edges.push(e);
  for(let x=Math.floor(Math.min(a[0],b[0])/50);x<=Math.floor(Math.max(a[0],b[0])/50);x++)for(let z=Math.floor(Math.min(a[1],b[1])/50);z<=Math.floor(Math.max(a[1],b[1])/50);z++){const k=x+','+z;if(!buckets.has(k))buckets.set(k,[]);buckets.get(k).push(e);}
  for(const [s,t,dir] of [[u,v,1],[v,u,-1]]){if(!adj.has(s))adj.set(s,[]);adj.get(s).push({v:t,e,dir});}
 }
 for(const r of ways.values())for(let i=1;i<r.pts.length;i++)add(r.pts[i-1],r.pts[i],r);
 function meta(e,dir){return {roadId:e.r.id,halfWidth:width(e.r),drivable:e.r.kind!=='footpath'&&!['no','private'].includes(e.r.access),direction:e.r.oneway?(e.r.direction===-1?-dir:dir):0,bridge:!!e.r.bridge};}
 function match(a,b){const p=[(a[0]+b[0])/2,(a[1]+b[1])/2],x=Math.floor(p[0]/50),z=Math.floor(p[1]/50),c=new Set();
  for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++)for(const e of buckets.get((x+i)+','+(z+j))??[])c.add(e);
  let best=null,score=Infinity;for(const e of c){const d=distSeg(p,e.a,e.b),da=distSeg(a,e.a,e.b),db=distSeg(b,e.a,e.b),dot=((b[0]-a[0])*(e.b[0]-e.a[0])+(b[1]-a[1])*(e.b[1]-e.a[1]))/(len(a,b)*e.d||1);if(Math.abs(dot)<.8||d>2||Math.max(da,db)>3)continue;const s=d+da+db+(1-Math.abs(dot))*2;if(s<score){score=s;best=meta(e,dot<0?-1:1);}}return best??{roadId:0,halfWidth:1,drivable:false,direction:0,bridge:false};
 }
 function mapped(points){return {points,segments:points.slice(1).map((b,i)=>match(points[i],b))};}
 function solve(start,end){
  const nearest=p=>[...nodes].map(([k,q])=>({k,d:len(p,q)})).filter(n=>n.d<=80).sort((a,b)=>a.d-b.d).slice(0,12);
  const a=nearest(start),b=nearest(end),endMap=new Map(b.map(n=>[n.k,n.d])),cost=new Map(),prev=new Map(),todo=new Set();for(const n of a){cost.set(n.k,n.d*8);todo.add(n.k);}
  let best=Infinity,last=null;while(todo.size){let u=null,d=Infinity;for(const k of todo)if(cost.get(k)<d){u=k;d=cost.get(k);}todo.delete(u);if(d>best)break;if(endMap.has(u)&&d+endMap.get(u)*8<best){best=d+endMap.get(u)*8;last=u;}
   for(const edge of adj.get(u)??[]){const nd=d+edge.e.d*(edge.e.r.kind==='footpath'?1.4:1);if(nd<(cost.get(edge.v)??Infinity)){cost.set(edge.v,nd);prev.set(edge.v,{u,...edge});todo.add(edge.v);}}
  }if(!last)return null;const points=[nodes.get(last)],segments=[];while(prev.has(last)){const p=prev.get(last);segments.push(meta(p.e,p.dir));last=p.u;points.push(nodes.get(last));}points.reverse();segments.reverse();if(points.length<4||len(points[0],start)>80||len(points.at(-1),end)>80)return null;return {points,segments};
 }
 const result={waterhead_ambleside:mapped(nav.arcade),picnic_black_sheep:mapped(nav.approaches.find(a=>a.id==='shop-link').points),lake_road_sprint:mapped(nav.approaches.find(a=>a.id==='east').points),borrans_road_sprint:mapped(nav.approaches.find(a=>a.id==='west').points),old_lake_road_sprint:mapped(nav.approaches.find(a=>a.id==='old').points),bowness_ferry:solve([2455.7,6157.3],[2091.2,7042.7]),troutbeck_brockhole:solve([3756.9,445.3],[1379.7,2415.6]),lakeside_newby:solve([-206.5,16720.9],[421,15362.1])};
 for(const [id,r] of Object.entries(result))console.log('[sprint-network]',id,r?JSON.stringify({points:r.points.length,matched:r.segments.filter(s=>s.roadId).length,lengthM:Math.round(r.points.slice(1).reduce((s,p,i)=>s+len(p,r.points[i]),0))}):'unavailable: no connected mapped route');
 return result;
}
