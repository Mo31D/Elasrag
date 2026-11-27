import type {BuildingFeature} from '../types/game';
export type StreetPoint=[number,number];
export const BLACK_SHEEP_BUILDING=423598927;
export const LAKE_ROAD_CORNER_BUILDING=423644520;
export const BLACK_SHEEP_STREET_CHUNK='0_-3';
export const BLACK_SHEEP_ROAD=32132710;
// Source footprint and road centreline remain unchanged. Local frontage divisions
// and widths are estimated from the supplied photographs, not a measured survey.
export function streetEdge(b:BuildingFeature,i:number){
 const a=b.pts[i],c=b.pts[(i+1)%b.pts.length],dx=c[0]-a[0],dz=c[1]-a[1],length=Math.hypot(dx,dz);
 const area=b.pts.reduce((sum,p,k)=>{const q=b.pts[(k+1)%b.pts.length];return sum+p[0]*q[1]-q[0]*p[1]},0);
 const s=area>0?1:-1,nx=s*dz/length,nz=-s*dx/length;
 return {x:b.cx+(a[0]+c[0])/2,z:b.cz+(a[1]+c[1])/2,nx,nz,yaw:Math.atan2(nx,nz),length};
}
export const LAKE_ROAD_HALF_WIDTH=2.9;
const road:StreetPoint[]=[[77.204,-1427.372],[75.047,-1393.998],[74.49,-1384.525]];
export function lakeRoadCentre(z:number){
 const [a,b]=z<=road[1][1]?[road[0],road[1]]:[road[1],road[2]];
 return a[0]+(b[0]-a[0])*(z-a[1])/(b[1]-a[1]);
}
export function blackSheepWestWall(z:number){
 const pts:StreetPoint[]=[[72.1,-1426.2],[71,-1404.9],[68.8,-1403.7],[68.6,-1393.8],[67.5,-1392.1]];
 for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];if(z>=a[1]&&z<=b[1])return a[0]+(b[0]-a[0])*(z-a[1])/(b[1]-a[1]);}
 return z<pts[0][1]?pts[0][0]:pts.at(-1)![0];
}
const sections=[-1425.8,-1420,-1414,-1408,-1404.9,-1403.7,-1398,-1393.998,-1393.8,-1392.2];
export function lakeRoadPavements():StreetPoint[][]{
 const west=sections.map(z=>[blackSheepWestWall(z)-.025,z] as StreetPoint);
 const kerb=sections.map(z=>[lakeRoadCentre(z)-LAKE_ROAD_HALF_WIDTH+.025,z] as StreetPoint);
 const east=sections.map(z=>[lakeRoadCentre(z)+LAKE_ROAD_HALF_WIDTH-.025,z] as StreetPoint);
 // The opposite side is narrow; limit it to the real building footprint.
 const outer=sections.map(z=>[Math.min(79.1+(78.1-79.1)*(z+1432.4)/46.6,lakeRoadCentre(z)+LAKE_ROAD_HALF_WIDTH+1.25),z] as StreetPoint);
 const out=[...east.map((p,i)=>({p,q:outer[i]})).slice(1).flatMap((v,i)=>{const a=east[i],b=outer[i];return b[0]>a[0]+.18&&v.q[0]>v.p[0]+.18?[[a,v.p,v.q,b]]:[];})];
 return [[...west,...kerb.reverse()],...out];
}
export function lakeRoadLineSegments():StreetPoint[][]{
 const out:StreetPoint[][]=[];
 for(const side of [-1,1])for(const offset of [.14,.33]){
  const pts=sections.map(z=>[lakeRoadCentre(z)+side*(LAKE_ROAD_HALF_WIDTH-offset),z] as StreetPoint);
  for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];out.push([[a[0]-.047,a[1]],[b[0]-.047,b[1]],[b[0]+.047,b[1]],[a[0]+.047,a[1]]]);}
 }
 return out;
}

export function lakeRoadArrow():StreetPoint[]{
 const z=-1390.1,x=lakeRoadCentre(z),dx=-.059,dz=1,angle=Math.atan2(dx,-dz);
 const shape:StreetPoint[]=[[-.12,-1.55],[.12,-1.55],[.12,.52],[.45,.52],[0,1.55],[-.45,.52],[-.12,.52]];
 // Forward follows the mapped one-way road's southbound direction.
 return shape.map(([u,v])=>[x+u*Math.cos(angle)+v*Math.sin(angle),z+u*Math.sin(angle)-v*Math.cos(angle)]);
}
