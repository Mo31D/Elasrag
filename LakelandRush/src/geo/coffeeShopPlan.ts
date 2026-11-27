import type {BuildingFeature} from '../types/game';
export const WATERHEAD_COFFEE_ID=423874283;
export type P=[number,number];
export function coffeeShopPlan(b:BuildingFeature){
 if(b.id!==WATERHEAD_COFFEE_ID||b.pts.length<5)return null;
 // The west-facing shore elevation is mapped chord 3 to 4. Keep its exact endpoints.
 const a=b.pts[3],c=b.pts[4],dx=c[0]-a[0],dz=c[1]-a[1],length=Math.hypot(dx,dz);
 if(length<6||length>12)return null;
 const nx=-dz/length,nz=dx/length,yaw=Math.atan2(nx,nz),x=b.cx+(a[0]+c[0])/2,z=b.cz+(a[1]+c[1])/2;
 const world=(u:number,v:number):P=>[x+u*nz+v*nx,z-u*nx+v*nz];
 const local=(p:P):P=>[(p[0]+b.cx-x)*nz-(p[1]+b.cz-z)*nx,(p[0]+b.cx-x)*nx+(p[1]+b.cz-z)*nz];
 const outline=b.pts.map(local);
 // Terrace tapers towards the narrower north end to retain the mapped promenade.
 const left=-length*.25,right=length*.43,depthL=1.18,depthR=1.95;
 const depthAt=(u:number)=>depthL+(depthR-depthL)*(u-left)/(right-left);
 const terrace:P[]=[[left,.03],[right,.03],[right,depthR],[left,depthL]];
 return {x,z,yaw,length,world,outline,left,right,depthAt,terrace};
}
