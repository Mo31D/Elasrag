import type {BuildingFeature} from '../types/game';
// Old Toll House: mapped footprint east of the existing Shell Shop asset.
export const PET_SHOP_ID=423828324;
export type P=[number,number];
export function petShopPlan(b:BuildingFeature){
 if(b.id!==PET_SHOP_ID||b.pts.length!==4)return null;
 const a=b.pts[1],c=b.pts[2],dx=c[0]-a[0],dz=c[1]-a[1],length=Math.hypot(dx,dz),nx=dz/length,nz=-dx/length;
 // Choose the normal away from the centroid.
 const mx=(a[0]+c[0])/2,mz=(a[1]+c[1])/2,s=nx*mx+nz*mz>0?1:-1;
 const yaw=Math.atan2(nx*s,nz*s),cos=Math.cos(yaw),sin=Math.sin(yaw);
 const outline=b.pts.map(([x,z]):P=>[x*cos-z*sin,x*sin+z*cos]);
 const world=(u:number,v:number):P=>[b.cx+u*cos+v*sin,b.cz-u*sin+v*cos];
 return {yaw,outline,world};
}
