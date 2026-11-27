import * as THREE from 'three';

export interface ProceduralTextureSet {
  slateStoneMap: THREE.CanvasTexture;
  slateStoneBump: THREE.CanvasTexture;
  roughcastBump: THREE.CanvasTexture;
  slateRoofMap: THREE.CanvasTexture;
  roadTarmacMap: THREE.CanvasTexture;
  plainAsphaltMap:THREE.CanvasTexture;
  pavingPathMap:THREE.CanvasTexture;
  gravelPathMap:THREE.CanvasTexture;
  grassTerrainMap: THREE.CanvasTexture;
  timberPlankMap: THREE.CanvasTexture;
  contactShadowMap: THREE.CanvasTexture;
  dispose: () => void;
}

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  return [c, ctx];
}

function configureColorTexture(
  canvas: HTMLCanvasElement,
  repeatX: number,
  repeatY: number,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

function configureDataTexture(
  canvas: HTMLCanvasElement,
  repeatX: number,
  repeatY: number,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

export function createProceduralTextureSet(maxAnisotropy: number): ProceduralTextureSet {
  // 1. Lakeland Grey-Green Slate Stone Wall Albedo & Bump
  const [stoneC, stoneCtx] = makeCanvas(256, 256);
  const [bumpC, bumpCtx] = makeCanvas(256, 256);
  stoneCtx.fillStyle = '#5c6466';
  stoneCtx.fillRect(0, 0, 256, 256);
  bumpCtx.fillStyle = '#222222';
  bumpCtx.fillRect(0, 0, 256, 256);

  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let row = 0; row < 12; row++) {
    const y = row * 21.3;
    let x = row % 2 === 0 ? 0 : -18;
    while (x < 256) {
      const w = 26 + rand() * 34;
      const h = 18.5 + (rand() - 0.5) * 2.5;
      const shade = 112 + Math.floor((rand() - 0.5) * 42);
      const greenShift = Math.floor(rand() * 12);
      const warmShift = Math.floor(rand() * 10);
      stoneCtx.fillStyle = `rgb(${shade + warmShift}, ${shade + greenShift}, ${shade - 4})`;
      stoneCtx.fillRect(x + 2, y + 2, w - 3, h - 2);

      const bVal = 155 + Math.floor(rand() * 85);
      bumpCtx.fillStyle = `rgb(${bVal},${bVal},${bVal})`;
      bumpCtx.fillRect(x + 2, y + 2, w - 3, h - 2);
      x += w;
    }
  }
  const slateStoneMap = configureColorTexture(stoneC, 2, 2, maxAnisotropy);
  const slateStoneBump = configureDataTexture(bumpC, 2, 2, maxAnisotropy);

  const [roughcast, roughcastContext] = makeCanvas(128, 128);
  const noise = roughcastContext.createImageData(128, 128);
  for (let i = 0; i < noise.data.length; i += 4) {
    const grain = 112 + Math.floor(rand() * 75);
    noise.data.set([grain, grain, grain, 255], i);
  }
  roughcastContext.putImageData(noise, 0, 0);
  const roughcastBump = configureDataTexture(roughcast, 2.5, 2.5, Math.min(maxAnisotropy, 4));

  // 2. Dark Westmorland Slate Roof Tiles
  const [roofC, roofCtx] = makeCanvas(256, 256);
  roofCtx.fillStyle = '#2d353c';
  roofCtx.fillRect(0, 0, 256, 256);
  for (let row = 0; row < 16; row++) {
    const y = row * 16;
    for (let col = 0; col < 10; col++) {
      const x = col * 26 + (row % 2) * 13 - 13;
      const v = 42 + Math.floor(rand() * 24);
      roofCtx.fillStyle = `rgb(${v}, ${v + 8}, ${v + 15})`;
      roofCtx.fillRect(x + 1, y + 1, 24, 14);
    }
  }
  const slateRoofMap = configureColorTexture(roofC, 2, 2, maxAnisotropy);

  // 3. British Lakeland Tarmac Road (with double yellow edge lines & white dashed centre)
  const [roadC, roadCtx] = makeCanvas(256, 256);
  roadCtx.fillStyle = '#2c3138';
  roadCtx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2400; i++) {
    const rx = rand() * 256;
    const ry = rand() * 256;
    const g = 38 + Math.floor(rand() * 28);
    roadCtx.fillStyle = `rgb(${g},${g + 2},${g + 6})`;
    roadCtx.fillRect(rx, ry, 2, 2);
  }
  const [asphaltC,asphaltCtx]=makeCanvas(256,256);asphaltCtx.drawImage(roadC,0,0);
  const plainAsphaltMap=configureColorTexture(asphaltC,1,1,maxAnisotropy);
  const [pavingC,pavingCtx]=makeCanvas(256,256);
  pavingCtx.fillStyle='#77766e';pavingCtx.fillRect(0,0,256,256);
  for(let row=0;row<8;row++)for(let col=-1;col<4;col++){
    const g=125+Math.floor(rand()*25);pavingCtx.fillStyle='rgb('+g+','+(g-3)+','+(g-10)+')';
    pavingCtx.fillRect(col*64+(row%2)*32+1,row*32+1,62,30);
  }
  const pavingPathMap=configureColorTexture(pavingC,1,1,maxAnisotropy);
  const [gravelC,gravelCtx]=makeCanvas(256,256);
  gravelCtx.fillStyle='#918776';gravelCtx.fillRect(0,0,256,256);
  for(let i=0;i<3600;i++){const g=105+Math.floor(rand()*72);gravelCtx.fillStyle='rgb('+g+','+(g-7)+','+(g-17)+')';gravelCtx.fillRect(rand()*256,rand()*256,1+rand()*2,1+rand()*2);}
  const gravelPathMap=configureColorTexture(gravelC,1,1,maxAnisotropy);
  // British double-yellow lines at edges
  roadCtx.fillStyle = '#e5b82e';
  roadCtx.fillRect(10, 0, 4, 256);
  roadCtx.fillRect(17, 0, 4, 256);
  roadCtx.fillRect(235, 0, 4, 256);
  roadCtx.fillRect(242, 0, 4, 256);
  // Dashed centre line
  roadCtx.fillStyle = '#e2e8f0';
  roadCtx.fillRect(125, 16, 6, 86);
  roadCtx.fillRect(125, 144, 6, 86);
  const roadTarmacMap = configureColorTexture(roadC, 1, 1, maxAnisotropy);

  // 4. Lakeland Grass & Fell Heather Texture
  const [grassC, grassCtx] = makeCanvas(256, 256);
  grassCtx.fillStyle = '#4b6b3a';
  grassCtx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 3200; i++) {
    const gx = rand() * 256;
    const gy = rand() * 256;
    const r = 56 + Math.floor(rand() * 34);
    const g = 86 + Math.floor(rand() * 44);
    const b = 38 + Math.floor(rand() * 26);
    grassCtx.fillStyle = `rgb(${r},${g},${b})`;
    grassCtx.fillRect(gx, gy, 3, 3);
  }
  const grassTerrainMap = configureColorTexture(grassC, 24, 24, maxAnisotropy);

  // 5. Timber Pier Planks
  const [woodC, woodCtx] = makeCanvas(128, 128);
  woodCtx.fillStyle = '#6c4d34';
  woodCtx.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 8; i++) {
    const y = i * 16;
    const shade = 88 + Math.floor(rand() * 26);
    woodCtx.fillStyle = `rgb(${shade + 18}, ${shade - 4}, ${shade - 26})`;
    woodCtx.fillRect(0, y + 1, 128, 14);
  }
  const timberPlankMap = configureColorTexture(woodC, 1, 4, maxAnisotropy);

  // 6. Soft Radial Contact Shadow Disc
  const [shadC, shadCtx] = makeCanvas(128, 128);
  const grad = shadCtx.createRadialGradient(64, 64, 4, 64, 64, 60);
  grad.addColorStop(0, 'rgba(8, 12, 18, 0.72)');
  grad.addColorStop(0.55, 'rgba(8, 12, 18, 0.34)');
  grad.addColorStop(1, 'rgba(8, 12, 18, 0)');
  shadCtx.fillStyle = grad;
  shadCtx.fillRect(0, 0, 128, 128);
  const contactShadowMap = new THREE.CanvasTexture(shadC);
  contactShadowMap.colorSpace = THREE.SRGBColorSpace;
  contactShadowMap.needsUpdate = true;

  return {
    slateStoneMap,
    slateStoneBump,
    roughcastBump,
    slateRoofMap,
    roadTarmacMap,plainAsphaltMap,pavingPathMap,gravelPathMap,
    grassTerrainMap,
    timberPlankMap,
    contactShadowMap,
    dispose: () => {
      slateStoneMap.dispose();
      slateStoneBump.dispose();
      roughcastBump.dispose();
      slateRoofMap.dispose();
      roadTarmacMap.dispose();plainAsphaltMap.dispose();pavingPathMap.dispose();gravelPathMap.dispose();
      grassTerrainMap.dispose();
      timberPlankMap.dispose();
      contactShadowMap.dispose();
    },
  };
}

/** Shared 512² Poly Haven surfaces for mapped waterfront features. */
export async function loadBuildingSurfaces(maxAnisotropy: number) {
  const loader = new THREE.TextureLoader();
  const loaded: THREE.Texture[] = [];
  const fetchSurface = async (name: string, repeat: number) => {
    const channels = ['color', 'normal', 'rough'] as const;
    const results = await Promise.allSettled(channels.map(async (channel) => {
      const texture = await loader.loadAsync(`${import.meta.env.BASE_URL}regions/windermere/materials/${name}-${channel}.webp`);
      loaded.push(texture);
      texture.colorSpace = channel === 'color' ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.setScalar(repeat);
      texture.anisotropy = Math.min(maxAnisotropy, 4);
      return texture;
    }));
    const [color, normal, rough] = results;
    if (color.status !== 'fulfilled' || normal.status !== 'fulfilled' || rough.status !== 'fulfilled') {
      throw new Error(`Could not load building surface ${name}`);
    }
    return { map: color.value, normalMap: normal.value, roughnessMap: rough.value };
  };
  const results = await Promise.allSettled([
    fetchSurface('castle_wall_slates', 0.4),
    fetchSurface('roof_slates_03', 2.5),
    fetchSurface('wood_planks_grey', 1.5),
  ]);
  const [wall, roof, deck] = results;
  const dispose = () => loaded.forEach(texture => texture.dispose());
  if (wall.status !== 'fulfilled' || roof.status !== 'fulfilled' || deck.status !== 'fulfilled') {
    dispose();
    return null;
  }
  return { wall: wall.value, roof: roof.value, deck: deck.value, dispose };
}
