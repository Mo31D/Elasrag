import {pointInRing} from '../geo/projection';
export type Point=[number,number];
export type SolidCollider={minX:number;maxX:number;minZ:number;maxZ:number;topY:number;isRoof:boolean;outline:Point[];roofAt?:(x:number,z:number)=>number|undefined};
export const WALK_RADIUS=.38,FLIGHT_RADIUS=.95,CAMERA_RADIUS=.18,ROOF_SKIN=.045;
const directions=Array.from({length:12},(_,i)=>[Math.cos(i*Math.PI/6),Math.sin(i*Math.PI/6)]);
// Solid footprint expanded by a circular player envelope, not an axis-aligned box.
export function solidHeight(c:SolidCollider,x:number,z:number,r:number):number{
 if(x<c.minX-r||x>c.maxX+r||z<c.minZ-r||z>c.maxZ+r)return -Infinity;
 const inside=pointInRing(x,z,c.outline);let nearest=Infinity,px=x,pz=z;
 for(let i=0;i<c.outline.length;i++){
  const [ax,az]=c.outline[i],[bx,bz]=c.outline[(i+1)%c.outline.length],dx=bx-ax,dz=bz-az;
  const t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/Math.max(1e-10,dx*dx+dz*dz))),u=ax+dx*t,v=az+dz*t,d=(x-u)**2+(z-v)**2;
  if(d<nearest){nearest=d;px=u;pz=v;}
 }
 if(!inside&&nearest>r*r+1e-9)return -Infinity;
 if(!c.roofAt)return c.topY;
 let top=-Infinity;
 const sample=(a:number,b:number)=>{const h=c.roofAt!(a,b);if(h!==undefined&&Number.isFinite(h))top=Math.max(top,h);};
 if(inside)sample(x,z);
 if(nearest<=r*r+1e-9)sample(px,pz);
 for(const [u,v] of directions){const a=x+u*r,b=z+v*r;if(pointInRing(a,b,c.outline))sample(a,b);}
 // Keep mapped wall volume solid even if an asset has incomplete roof geometry.
 return Number.isFinite(top)?top:c.topY;
}
export function highestSolid(colliders:Iterable<SolidCollider>,x:number,z:number,r:number):number{
 let top=-Infinity;for(const c of colliders)top=Math.max(top,solidHeight(c,x,z,r));return top;
}
export function blocksMove(top:number,feet:number,currentTop:number,grounded:boolean):boolean{
 if(!Number.isFinite(top)||feet>=top+ROOF_SKIN-.001)return false;
 // A grounded avatar already on a roof can follow its slope, but cannot step
 // onto a tall wall from the street or climb a roof while flying.
 return !(grounded&&Number.isFinite(currentTop)&&feet>=currentTop+ROOF_SKIN-.13&&top-currentTop<=.16);
}
export function cameraFraction(from:{x:number;y:number;z:number},to:{x:number;y:number;z:number},height:(x:number,z:number)=>number){
 const count=Math.max(1,Math.ceil(Math.hypot(to.x-from.x,to.y-from.y,to.z-from.z)/.12));
 for(let i=1;i<=count;i++){const t=i/count,x=from.x+(to.x-from.x)*t,z=from.z+(to.z-from.z)*t,y=from.y+(to.y-from.y)*t;
  if(y<height(x,z)+.12)return Math.max(0,(i-2)/count);
 }return 1;
}
