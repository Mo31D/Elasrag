import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

import type { Shop } from '../data/shopEntrances';

export function createShopInterior(environment: THREE.Texture | null, shop: Shop) {
  const cafe = shop.id === 'picnic';
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222722);
  scene.environment = environment;
  scene.environmentIntensity = .55;
  const panels = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const blockers: Array<[number, number, number, number]> = [];
  const finish = (color: number, roughness = .85) => new THREE.MeshStandardMaterial({ color, roughness });
  const wood = finish(cafe?0x99907d:0x785145);
  const darkWood = finish(cafe?0x726d5d:0x493228);
  const trim = finish(cafe?0x324d42:0x263c32);
  const plaster = finish(0xd5c7a4);
  const darkGlass = finish(0x263d43,.26);
  const metal = finish(0x191c19,.37);
  const product = [0xb39d73,0xa56340,0x697d69,0x4e6176,0x813e3a].map(color => finish(color));
  const glow = new THREE.MeshStandardMaterial({ color: 0xfce7ba, emissive: 0xfcbe68, emissiveIntensity: .85 });

  function box(mat: THREE.Material, x: number, y: number, z: number, w: number, h: number, d: number) {
    const g = new THREE.BoxGeometry(w,h,d).translate(x,y,z);
    const entries = panels.get(mat) ?? [];
    entries.push(g);
    panels.set(mat,entries);
  }
  for (let i=0;i<26;i++) {
    const tone = i%3 === 0 ? wood : darkWood;
    box(tone,-3.625+i*.29,-.035,0,.286,.065,11);
  }
  box(plaster,-3.87,1.62,0,.15,3.25,11);
  box(plaster,3.87,1.62,0,.15,3.25,11);
  box(plaster,0,1.62,-5.45,7.8,3.25,.16);
  box(plaster,0,3.26,0,7.8,.14,11);
  box(trim,0,1.63,5.45,7.8,3.25,.14);
  for (const x of [-2.35,0,2.35]) {
    box(darkGlass,x,1.51,5.34,1.65,2.46,.045);
    if (x===0) {
      box(trim,0,.29,5.23,1.38,.54,.12);
      box(metal,.51,1.08,5.16,.04,.21,.09);
    }
    for (const h of [.3,1.4,2.75]) box(trim,x,h,5.24,1.81,.075,.15);
    for (const xx of [-.85,0,.85]) box(trim,x+xx,1.5,5.23,.085,2.53,.15);
  }
  if (cafe) {
    // The seating and counter arrangement is an illustrative café layout.
    for (const side of [-1,1]) for (const z of [-1.4,1.2,3.2]) {
      const x = side*2.46;
      blockers.push([x-.67,x+.67,z-.68,z+.68]);
      box(wood,x,.76,z,1.08,.09,.73);
      box(metal,x,.37,z,.09,.72,.09);
      box(metal,x,.054,z,.52,.10,.49);
      for (const seat of [-1,1]) {
        box(trim,x,.44,z+seat*.64,.57,.10,.37);
        box(trim,x,.69,z+seat*.80,.57,.52,.07);
      }
    }
    blockers.push([-2.8,.04,-4.95,-4.02]);
    box(trim,-1.45,.49,-4.48,2.65,.97,.87);
    box(darkWood,-1.45,.99,-4.48,2.80,.09,.94);
    box(darkGlass,-2.11,1.28,-4.48,.92,.45,.54);
  } else {
  for (const side of [-1,1]) {
    const x = side*3.27;
    blockers.push([x-.43,x+.43,-4.58,3.02]);
    for (const z of [-4.45,-2.55,-.65,1.25,3]) box(trim,x,1.17,z,.79,2.25,.075);
    for (let tier=0;tier<5;tier++) {
      const h = .20+tier*.45;
      box(wood,x,h,-.71,.78,.085,7.55);
      for (let k=0;k<22;k++) {
        const z=-4.27+k*.34;
        const size=.14+(k%4)*.025;
        box(product[(k+tier+side+5)%5],x+side*.05,h+.075+size*.5,z,size,.08+size,.21);
      }
    }
  }
  // Walkable open perimeter and two separate display islands.
  for (const [x,z] of [[-.85,.1],[.92,-2.30]]) {
    blockers.push([x-.48,x+.48,z-1,z+1]);
    box(trim,x,.42,z,.9,.76,1.82);
    box(wood,x,.84,z,1,.10,1.94);
    for (let i=0;i<7;i++) box(product[i%5],x,.97,z-.76+i*.24,.34,.14,.20);
  }
  blockers.push([.2,2.52,-4.85,-3.88]);
  }
  box(trim,1.35,.50,-4.39,2.29,1,.9);
  box(darkWood,1.35,1.04,-4.39,2.47,.12,1.03);
  box(metal,1.92,1.19,-4.47,.38,.2,.24);
  for (const z of [-3.65,0,3.45]) {
    box(darkWood,0,3.06,z,7.58,.18,.24);
    for (const x of [-1.56,1.56]) {
      box(metal,x,2.83,z,.36,.19,.36);
      box(glow,x,2.73,z,.33,.08,.33);
    }
  }
  const sign = document.createElement('canvas');
  sign.width = 512; sign.height = 128;
  const ctx = sign.getContext('2d')!;
  ctx.fillStyle = '#293b32';
  ctx.fillRect(0,0,512,128);
  ctx.fillStyle = '#e0cda1';
  ctx.textAlign = 'center';
  ctx.font = 'bold 32px Georgia';
  ctx.fillText(shop.name.toUpperCase(),256,55);
  ctx.font = '22px Georgia';
  ctx.fillText(shop.subtitle,256,96);
  const signTexture = new THREE.CanvasTexture(sign);
  signTexture.colorSpace = THREE.SRGBColorSpace;
  const board = new THREE.Mesh(new THREE.PlaneGeometry(3.16,.79),
    new THREE.MeshBasicMaterial({map:signTexture}));
  board.position.set(-.23,2.3,-5.34);
  scene.add(board);

  for (const [material, geometries] of panels) {
    const geometry = mergeGeometries(geometries);
    geometries.forEach(item => item.dispose());
    if (geometry) scene.add(new THREE.Mesh(geometry,material));
  }
  scene.add(new THREE.HemisphereLight(0xffe5c2,0x45392f,1.2));
  const key = new THREE.DirectionalLight(0xffd3a4,1.7);
  key.position.set(1,4,3);
  scene.add(key);
  const fill = new THREE.PointLight(0xffd4a0,24,13);
  fill.position.set(0,2.58,-1.8);
  scene.add(fill);
  const available = (x: number,z: number) => Math.abs(x)<3.45 && Math.abs(z)<5.04
    && blockers.every(([minX,maxX,minZ,maxZ]) => x<minX-.19 || x>maxX+.19 || z<minZ-.19 || z>maxZ+.19);
  return {
    scene, available,
    dispose() {
      scene.traverse(item => {
        if (!(item instanceof THREE.Mesh)) return;
        item.geometry.dispose();
        if (item.material instanceof THREE.Material) item.material.dispose();
      });
      signTexture.dispose();
    },
  };
}
