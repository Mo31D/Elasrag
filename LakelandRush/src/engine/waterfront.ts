import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import publicRealm from '../data/waterhead-public-realm.json';

type Point = readonly number[];
type Ground = (x: number, z: number) => number;

export const WATERHEAD_SIDEWALKS = new Set(publicRealm.sidewalk.map(feature => feature.id));

export function groundSurface(points: Point[], ground: Ground, offset: number, dense=false) {
  const shape = new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, -z)));
  let geo:THREE.BufferGeometry = new THREE.ShapeGeometry(shape);
  geo.rotateX(-Math.PI / 2);
  if(dense){
    const p=geo.attributes.position,idx=geo.index,vertices:number[]=[],uv:number[]=[];
    type P=[number,number];
    const get=(i:number):P=>{const j=idx?idx.getX(i):i;return [p.getX(j),p.getZ(j)];};
    const split=(a:P,b:P,c:P,depth:number)=>{
      const edges=[[a,b,c],[b,c,a],[c,a,b]].sort((u,v)=>Math.hypot(v[0][0]-v[1][0],v[0][1]-v[1][1])-Math.hypot(u[0][0]-u[1][0],u[0][1]-u[1][1]));
      const [u,v,w]=edges[0];if(depth<10&&Math.hypot(u[0]-v[0],u[1]-v[1])>2.5){const m:P=[(u[0]+v[0])/2,(u[1]+v[1])/2];split(u,m,w,depth+1);split(m,v,w,depth+1);return;}
      for(const [x,z] of [a,b,c]){vertices.push(x,0,z);uv.push(x/3,z/3);}
    };
    for(let i=0;i<(idx?.count??p.count);i+=3)split(get(i),get(i+1),get(i+2),0);
    geo.dispose();geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  }
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setY(i, ground(pos.getX(i), pos.getZ(i)) + offset);
  geo.computeVertexNormals();
  return geo;
}

function makePavingTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#69645a';
  ctx.fillRect(0, 0, 128, 128);
  for (let row = 0; row < 8; row++) {
    for (let column = -1; column < 4; column++) {
      const tint = 122 + ((column + 1) * 17 + row * 13) % 22;
      ctx.fillStyle = `rgb(${tint + 8},${tint + 5},${tint})`;
      ctx.fillRect(column * 32 + (row % 2) * 16 + 1, row * 16 + 1, 30, 14);
    }
  }
  const result = new THREE.CanvasTexture(canvas);
  result.wrapS = result.wrapT = THREE.RepeatWrapping;
  result.colorSpace = THREE.SRGBColorSpace;
  return result;
}

export function buildWaterfrontDetails(ground: Ground, inLake: (x: number, z: number) => boolean, asphaltMap:THREE.Texture|null=null) {
  const group = new THREE.Group();
  const batches = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const pavingMap = makePavingTexture();
  const paving = new THREE.MeshStandardMaterial({ color: 0xadab9e, map: pavingMap, roughness: 0.94 });
  const asphalt = new THREE.MeshStandardMaterial({ color:0xffffff,map:asphaltMap,roughness:.97,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1 });
  const apron = new THREE.MeshStandardMaterial({ color: 0x86847c, roughness: .9 });
  const granite = new THREE.MeshStandardMaterial({ color: 0x78736a, roughness: 0.91 });
  const iron = new THREE.MeshStandardMaterial({ color: 0x242f31, roughness: 0.62, metalness: 0.2 });
  const enamel = new THREE.MeshStandardMaterial({ color: 0xc6c4b4, roughness: 0.56, metalness: 0.1 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x554034, roughness: 0.86 });
  const gravelCanvas=document.createElement('canvas');gravelCanvas.width=gravelCanvas.height=256;
  const gc=gravelCanvas.getContext('2d')!;gc.fillStyle='#77736a';gc.fillRect(0,0,256,256);
  let seed=691;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<5400;i++){const x=rnd()*256,y=rnd()*256,r=.6+rnd()*2.5,g=100+Math.floor(rnd()*80);
   gc.fillStyle='rgba(28,27,24,.25)';gc.beginPath();gc.ellipse(x+.5,y+.6,r*1.4,r*.8,rnd()*Math.PI,0,Math.PI*2);gc.fill();
   gc.fillStyle='rgb('+ (g+6)+','+(g+3)+','+g+')';gc.beginPath();gc.ellipse(x,y,r*1.3,r*.7,rnd()*Math.PI,0,Math.PI*2);gc.fill();}
  const gravelMap=new THREE.CanvasTexture(gravelCanvas);gravelMap.wrapS=gravelMap.wrapT=THREE.RepeatWrapping;gravelMap.colorSpace=THREE.SRGBColorSpace;
  const sand = new THREE.MeshStandardMaterial({ color: 0xe0dcd1,map:gravelMap,roughness: .98 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x4c4537, roughness: 0.95 });
  const canopy = new THREE.MeshStandardMaterial({ color: 0x426137, roughness: 0.93 });
  const localMaterials = [paving, asphalt, apron, granite, iron, enamel, wood, sand, bark, canopy];
  function batch(geo: THREE.BufferGeometry, mat: THREE.Material) {
    const list = batches.get(mat) ?? [];
    list.push(geo);
    batches.set(mat, list);
  }
  function box(x: number, y: number, z: number, w: number, h: number, d: number, angle: number,
               mat: THREE.Material) {
    const geo = new THREE.BoxGeometry(w, h, d);
    geo.rotateY(angle);
    geo.translate(x, y, z);
    batch(geo, mat);
  }
  function bar(a: THREE.Vector3, b: THREE.Vector3, radius: number, mat: THREE.Material) {
    const axis = b.clone().sub(a);
    const geo = new THREE.CylinderGeometry(radius, radius, axis.length(), 5);
    geo.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis.normalize()));
    geo.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
    batch(geo, mat);
  }
  for (const area of publicRealm.parking) batch(groundSurface(area.points, ground, 0.065,true), asphalt);
  // Approximate forecourt extents from the frontage and its mapped entrance.
  batch(groundSurface([[66.1,-373.2],[75.6,-367.7],[79.8,-371.1],[68.3,-377.8]],ground,.075), apron);
  batch(groundSurface([[85.3,-361],[91.1,-364.0],[101,-342.6],[97.0,-338.9]],ground,.09), apron);
  for (const area of publicRealm.shore) {const geo=groundSurface(area.points,ground,.035,true),pos=geo.attributes.position,uv=geo.attributes.uv;for(let i=0;i<pos.count;i++)uv.setXY(i,pos.getX(i)/1.25,pos.getZ(i)/1.25);batch(geo,sand);}

  // The centre lines are mapped. Widths and kerb section are representative.
  for (const path of publicRealm.sidewalk) {
    for (let i = 1; i < path.points.length; i++) {
      const [ax, az] = path.points[i - 1];
      const [bx, bz] = path.points[i];
      const len = Math.hypot(bx - ax, bz - az);
      if (len < 0.1) continue;
      const count = Math.ceil(len / 2);
      const rx = (bz - az) / len;
      const rz = -(bx - ax) / len;
      for (let j = 0; j < count; j++) {
        const a = [ax + (bx - ax) * j / count, az + (bz - az) * j / count];
        const b = [ax + (bx - ax) * (j + 1) / count, az + (bz - az) * (j + 1) / count];
        for (const [left, right, height, mat] of [
          [-0.77, 0.77, 0.16, paving],
          [-0.87, -0.73, 0.17, granite],
          [0.73, 0.87, 0.17, granite],
        ] as const) {
          const points = [
            [a[0] + rx * left, a[1] + rz * left], [b[0] + rx * left, b[1] + rz * left],
            [b[0] + rx * right, b[1] + rz * right], [a[0] + rx * right, a[1] + rz * right],
          ];
          batch(groundSurface(points, ground, height), mat);
        }
      }
    }
  }

  function fence(points: Point[], material: THREE.Material, decorative: boolean) {
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      const count = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 1.75));
      const at = (t: number, h: number) => {
        const x = THREE.MathUtils.lerp(a[0], b[0], t), z = THREE.MathUtils.lerp(a[1], b[1], t);
        return new THREE.Vector3(x, ground(x, z) + h, z);
      };
      for (let n = 0; n < count; n++) {
        const l = n / count, r = (n + 1) / count;
        bar(at(l, .02), at(l, 1.03), .035, material);
        bar(at(l, .96), at(r, .96), .024, material);
        bar(at(l, .22), at(r, .22), .024, material);
        if (decorative) {
          bar(at(l, .24), at(r, .94), .013, material);
          bar(at(l, .94), at(r, .24), .013, material);
        } else {
          for (let j = 1; j < 8; j++) {
            const t = THREE.MathUtils.lerp(l, r, j / 8);
            bar(at(t, .23), at(t, .96), .012, material);
          }
        }
      }
      bar(at(1, .02), at(1, 1.03), .035, material);
    }
  }
  for (const way of publicRealm.railings) fence(way.points, iron, false);
  // Terrace wall openings and the two iron panels are aligned from the historical street photo.
  const terrace = [[[85.8, -361.1], [91.1, -348.6]], [[93.1, -344.4], [96.8, -337.7]]];
  for (const run of terrace) {
    fence(run, enamel, true);
    const [a, b] = run;
    const dx = b[0] - a[0], dz = b[1] - a[1];
    const x = (a[0] + b[0]) / 2, z = (a[1] + b[1]) / 2;
    box(x, ground(x, z) + .13, z, .32, .28, Math.hypot(dx, dz), Math.atan2(dx, dz), granite);
  }
  for (const object of publicRealm.furniture) {
    const [x, z] = object.point;
    const y = ground(x, z);
    if (object.kind === 'bench') {
      const angle = -0.47;
      box(x, y + .48, z, 1.56, .075, .39, angle, wood);
      box(x - .09, y + .78, z - .17, 1.56, .29, .055, angle, wood);
      for (const sign of [-1, 1]) {
        box(x + sign * .57, y + .24, z + sign * .29, .075, .48, .34, angle, iron);
      }
    } else if (object.kind === 'waste_basket') {
      bar(new THREE.Vector3(x, y, z), new THREE.Vector3(x, y + .82, z), .24, iron);
      bar(new THREE.Vector3(x, y + .82, z), new THREE.Vector3(x, y + .89, z), .26, granite);
    } else {
      const height = 6.5 + (object.id % 5) * .67;
      bar(new THREE.Vector3(x, y, z), new THREE.Vector3(x + .23, y + height * .73, z), .18, bark);
      for (let j = 0; j < 13; j++) {
        const angle = j * 2.4 + object.id % 7;
        const size = height * (.155 + (j % 4) * .016);
        const crown = new THREE.IcosahedronGeometry(size, 1);
        const verts = crown.attributes.position;
        for (let v = 0; v < verts.count; v++) {
          const px = verts.getX(v), py = verts.getY(v), pz = verts.getZ(v);
          const k = 1 + Math.sin(px*16 + py*12 + pz*9) * .115;
          verts.setXYZ(v, px*k, py*k, pz*k);
        }
        crown.computeVertexNormals();
        crown.scale(1.23, .82 + (j % 2) * .15, 1);
        crown.translate(x + Math.cos(angle) * size * 1.4, y + height - (j % 4) * height * .095,
          z + Math.sin(angle) * size * 1.3);
        batch(crown, canopy);
      }
    }
  }

  for (const [mat, geometries] of batches) {
    const expanded = geometries.map(geometry => geometry.index ? geometry.toNonIndexed() : geometry);
    const geometry = mergeGeometries(expanded);
    for (const g of new Set([...geometries, ...expanded])) g.dispose();
    if (!geometry) continue;
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.receiveShadow = true;
    mesh.castShadow = mat === canopy || mat === bark || mat === iron;
    group.add(mesh);
  }
  return {
    group,
    dispose() {
      group.traverse(object => { if (object instanceof THREE.Mesh) object.geometry.dispose(); });
      for (const mat of localMaterials) mat.dispose();
      pavingMap.dispose();gravelMap.dispose();
    },
  };
}
