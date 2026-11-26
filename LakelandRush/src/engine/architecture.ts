import * as THREE from 'three';
import type { BuildingFeature, RoadFeature } from '../types/game';
import { segmentDistance } from '../geo/worldCore';

type Point = [number,number];
type Vertex = [number,number,number];

class Surface {
  private vertices: number[] = [];
  private uv: number[] = [];

  face(points: Vertex[], uv: Point[]) {
    for (let i=1;i+1<points.length;i++) for (const j of [0,i,i+1]) {
      this.vertices.push(...points[j]);
      this.uv.push(...uv[j]);
    }
  }

  finish() {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.Float32BufferAttribute(this.vertices,3));
    geo.setAttribute('uv',new THREE.Float32BufferAttribute(this.uv,2));
    geo.computeVertexNormals();
    return geo;
  }
}

export function backgroundArchitecture(building: BuildingFeature, ground: number, roads: RoadFeature[]) {
  const {cx,cz} = building;
  const area = building.pts.reduce((sum,[x,z],i) => {
    const [nx,nz] = building.pts[(i+1)%building.pts.length];
    return sum + x*nz-z*nx;
  },0);
  const ring = area < 0 ? building.pts : [...building.pts].reverse();
  const edges = ring.map((a,i)=>{
    const b=ring[(i+1)%ring.length];
    return {a,b,length:Math.hypot(b[0]-a[0],b[1]-a[1])};
  });
  const major=edges.reduce((a,b)=>a.length>b.length?a:b);
  if (major.length<.05) return null;
  const axis: Point=[(major.b[0]-major.a[0])/major.length,(major.b[1]-major.a[1])/major.length];
  const cross=(p: Point)=> p[0]*(-axis[1])+p[1]*axis[0];
  const crossValues=ring.map(cross);
  const lo=Math.min(...crossValues), hi=Math.max(...crossValues), ridge=(lo+hi)/2;
  const rise=Math.min(2.65,Math.max(.38,(hi-lo)*.33),Math.max(.45,building.h*.29));
  const eave=ground+Math.max(2.45,building.h-rise);
  const top=(p: Point)=>eave+rise*(1-Math.abs(cross(p)-ridge)/Math.max(.05,(hi-lo)/2));
  const masonry = new Surface(), tiles = new Surface(), glazing = new Surface(), joinery = new Surface();

  // Inferred entrance placement. Rank facade centres against the nearby mapped public ways.
  let bestEdge = major, best = Infinity;
  for (const edge of edges) {
    if (edge.length < 2.1) continue;
    const middle:Point=[(edge.a[0]+edge.b[0])/2+cx,(edge.a[1]+edge.b[1])/2+cz];
    const normal:Point=[-(edge.b[1]-edge.a[1])/edge.length,(edge.b[0]-edge.a[0])/edge.length];
    let distance=Infinity;
    for (const r of roads) {
      if (r.kind==='ferry'||r.kind==='railway') continue;
      for (let i=1;i<r.pts.length;i++) {
        const a=r.pts[i-1], b=r.pts[i];
        if (Math.max(a[0],b[0])<middle[0]-45 || Math.min(a[0],b[0])>middle[0]+45
          || Math.max(a[1],b[1])<middle[1]-45 || Math.min(a[1],b[1])>middle[1]+45) continue;
        const dx=b[0]-a[0], dz=b[1]-a[1];
        const t=THREE.MathUtils.clamp(((middle[0]-a[0])*dx+(middle[1]-a[1])*dz)/(dx*dx+dz*dz||1),0,1);
        const ahead=(a[0]+t*dx-middle[0])*normal[0]+(a[1]+t*dz-middle[1])*normal[1];
        if (ahead>0) distance=Math.min(distance,segmentDistance(middle,a,b));
      }
    }
    const score=distance-Math.min(8,edge.length)*.3;
    if(score<best){best=score;bestEdge=edge;}
  }

  for(const edge of edges){
    const {a,b,length}=edge;
    if(length<.04) continue;
    const dx=(b[0]-a[0])/length, dz=(b[1]-a[1])/length;
    const local=(u:number):Point=>[a[0]+dx*u,a[1]+dz*u];
    const p=(u:number,y:number,d=0):Vertex=>[cx+a[0]+dx*u-dz*d,y,cz+a[1]+dz*u+dx*d];
    const quad=(surface:Surface,l:number,r:number,from:number,to:number,d=0) => {
      if(r-l<.01 || to-from<.01) return;
      surface.face([p(l,from,d),p(r,from,d),p(r,to,d),p(l,to,d)],[[l,from],[r,from],[r,to],[l,to]]);
    };
    const cuts=[0,length];
    const ca=cross(a), cb=cross(b);
    const line=(ridge-ca)/(cb-ca);
    if (line>0 && line<1) cuts.splice(1,0,line*length);
    for(let i=1;i<cuts.length;i++){
      const l=cuts[i-1], r=cuts[i];
      masonry.face([p(l,eave),p(r,eave),p(r,top(local(r))),p(l,top(local(l)))],
        [[l,eave],[r,eave],[r,top(local(r))],[l,top(local(l))]]);
    }
    const bays=length>2.2 ? Math.min(8,Math.max(1,Math.floor(length/2.35))) : 0;
    const doorBay=Math.floor((bays-1)/2);
    const floors=Math.min(3,Math.max(1,Math.floor((eave-ground)/2.45)));
    let cursor=0;
    for(let bay=0;bay<bays;bay++){
      const center=length*(bay+.5)/bays;
      const half=Math.min(.54,length/bays*.27);
      const l=center-half, r=center+half;
      const door=edge===bestEdge && bay===doorBay;
      quad(masonry,cursor,l,ground-2.2,eave);
      let low=ground-2.2;
      for(let floor=0;floor<floors;floor++){
        const base=ground+floor*(eave-ground)/floors;
        const threshold=door&&floor===0;
        const from=base+(threshold?.015:.88), to=Math.min(base+(threshold?2.12:1.98),eave-.16);
        if (to-from<.22) continue;
        quad(masonry,l,r,low,from);
        const inset=-.15;
        masonry.face([p(l,from),p(l,to),p(l,to,inset),p(l,from,inset)],[[0,from],[0,to],[.15,to],[.15,from]]);
        masonry.face([p(r,to),p(r,from),p(r,from,inset),p(r,to,inset)],[[0,to],[0,from],[.15,from],[.15,to]]);
        quad(joinery,l,r,from,to,inset);
        quad(threshold?joinery:glazing,l+.06,r-.06,from+.061,to-.06,inset+.011);
        if(!threshold){
          quad(joinery,center-.022,center+.022,from,to,inset+.025);
          quad(joinery,l-.06,r+.06,from-.07,from+.015,.05);
        } else {
          quad(glazing,l+.14,r-.14,to-.76,to-.15,inset+.027);
          quad(glazing,r-.17,r-.103,from+.99,from+1.037,inset+.04);
        }
        low=to;
      }
      quad(masonry,l,r,low,eave);
      cursor=r;
    }
    quad(masonry,cursor,length,ground-2.2,eave);
  }

  // Clip the actual footprint triangles along the roof ridge; no bounding-box roof overhang.
  const triangles=THREE.ShapeUtils.triangulateShape(ring.map(([x,z])=>new THREE.Vector2(x,z)),[]);
  for(const tri of triangles) for(const sign of [-1,1]){
    const vertices=tri.map(i=>ring[i]);
    const clipped:Point[]=[];
    for(let i=0;i<3;i++){
      const a=vertices[i], b=vertices[(i+1)%3];
      const ca=(cross(a)-ridge)*sign, cb=(cross(b)-ridge)*sign;
      if(ca>=0) clipped.push(a);
      if((ca<0&&cb>0)||(ca>0&&cb<0)){
        const t=ca/(ca-cb);
        clipped.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);
      }
    }
    if(clipped.length<3) continue;
    const [a,b,c]=clipped;
    if((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])>0) clipped.reverse();
    tiles.face(clipped.map(p=>[p[0]+cx,top(p),p[1]+cz]),clipped);
  }
  return {masonry:masonry.finish(),tiles:tiles.finish(),glazing:glazing.finish(),joinery:joinery.finish()};
}
