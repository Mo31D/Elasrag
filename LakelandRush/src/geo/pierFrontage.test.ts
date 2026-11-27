import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('Ambleside Pier green joinery faces the street, and geographic shell is retained',()=>{
 const bytes=readFileSync(new URL('../../public/regions/windermere/assets/ambleside-pier.glb',import.meta.url));
 assert.equal(bytes.readUInt32LE(0),0x46546c67);
 const n=bytes.readUInt32LE(12),g=JSON.parse(bytes.toString('utf8',20,20+n)),start=28+n;
 const positions=(material:string):number[][]=>{
  const primitive=g.meshes[0].primitives.find((p:{material:number})=>g.materials[p.material].name===material);
  const a=g.accessors[primitive.attributes.POSITION],view=g.bufferViews[a.bufferView],offset=start+(view.byteOffset??0)+(a.byteOffset??0);
  return Array.from({length:a.count},(_,i)=>[0,1,2].map(k=>bytes.readFloatLE(offset+i*12+k*4)));
 };
 const c=JSON.parse(readFileSync(new URL('../../public/regions/windermere/chunks/0_-1.json',import.meta.url),'utf8'));
 const b=c.buildings.find((x:{id:number})=>x.id===423828335);
 const green=positions('Deep green joinery');
 const a=b.pts[2],z=b.pts[0],dx=z[0]-a[0],dz=z[1]-a[1],length=Math.hypot(dx,dz);
 const mx=(a[0]+z[0])/2,mz=(a[1]+z[1])/2;
 // Street-side outward normal points east; all green pieces must be in front of chord.
 assert.ok(green.every(p=>((p[0]-mx)*dz-(p[2]-mz)*dx)/length>.25));
 const stone=positions('Dark plinth');
 for(const [x,y] of b.pts)for(const h of [-1.15,.28])assert.ok(stone.some(p=>Math.hypot(p[0]-x,p[2]-y)<.001&&Math.abs(p[1]-h)<.001));
});
