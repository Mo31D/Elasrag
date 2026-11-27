import type {BuildingFeature} from '../types/game';
export type Ground=(x:number,z:number)=>number;
type Position={count:number;getX(i:number):number;getY(i:number):number;getZ(i:number):number};
type Index={count:number;getX(i:number):number};
export function triangleGround(pos:Position,index:Index|null,cell=32){
 const bins=new Map<string,number[]>(),v=(i:number)=>index?index.getX(i):i;
 for(let i=0;i<(index?.count??pos.count);i+=3){
  const a=v(i),b=v(i+1),c=v(i+2),xs=[pos.getX(a),pos.getX(b),pos.getX(c)],zs=[pos.getZ(a),pos.getZ(b),pos.getZ(c)];
  for(let x=Math.floor(Math.min(...xs)/cell);x<=Math.floor(Math.max(...xs)/cell);x++)for(let z=Math.floor(Math.min(...zs)/cell);z<=Math.floor(Math.max(...zs)/cell);z++){
   const k=x+':'+z,arr=bins.get(k);if(arr)arr.push(i);else bins.set(k,[i]);
  }
 }
 return (x:number,z:number):number|undefined=>{
  let h=-Infinity;
  for(const i of bins.get(Math.floor(x/cell)+':'+Math.floor(z/cell))??[]){
   const a=v(i),b=v(i+1),c=v(i+2),ax=pos.getX(a),az=pos.getZ(a),bx=pos.getX(b)-ax,bz=pos.getZ(b)-az,cx=pos.getX(c)-ax,cz=pos.getZ(c)-az;
   const det=bx*cz-bz*cx;if(Math.abs(det)<1e-9)continue;
   const u=((x-ax)*cz-(z-az)*cx)/det,w=(bx*(z-az)-bz*(x-ax))/det;
   if(u>=-1e-6&&w>=-1e-6&&u+w<=1+1e-6)h=Math.max(h,(1-u-w)*pos.getY(a)+u*pos.getY(b)+w*pos.getY(c));
  }
  return Number.isFinite(h)?h:undefined;
 };
}
export function buildingGrades(b:BuildingFeature,ground:Ground){
 const samples=[ground(b.cx,b.cz)];
 for(let i=0;i<b.pts.length;i++){
  const a=b.pts[i],c=b.pts[(i+1)%b.pts.length],n=Math.max(1,Math.ceil(Math.hypot(c[0]-a[0],c[1]-a[1])/2));
  for(let k=0;k<=n;k++)samples.push(ground(b.cx+a[0]+(c[0]-a[0])*k/n,b.cz+a[1]+(c[1]-a[1])*k/n));
 }
 const valid=samples.filter(Number.isFinite);
 return {high:Math.max(.45,...valid),low:Math.max(.45,Math.min(...(valid.length?valid:[.45])))};
}
export function edgeGrade(x:number,z:number,nx:number,nz:number,width:number,yaw:number,ground:Ground){
 return Math.max(.45,...[-.5,0,.5].map(f=>ground(x+nx*.18+Math.cos(yaw)*width*f,z+nz*.18-Math.sin(yaw)*width*f)));
}
