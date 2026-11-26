import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type {
  BuildingFeature,
  LakeData,
  TerrainGridData,
  WorldChunkData,
} from '../types/game';
import { isPointInLake, pointInRing, sampleTerrainHeight } from '../geo/projection';
import { buildWaterheadShoreDistance, WATERHEAD_WATER_BOUNDS } from './waterhead-water';
import { buildWaterfrontDetails, groundSurface, WATERHEAD_SIDEWALKS } from './waterfront';
import { buildSignage } from './signage';
import amblesideSurfaces from '../data/ambleside-surfaces.json';
import amblesideNavigation from '../data/ambleside-navigation.json';
import buildingAssetMetadata from '../data/building-assets.json';
import type { loadBuildingSurfaces, ProceduralTextureSet } from './textures';

export interface WorldMaterials {
  stoneWall: THREE.MeshStandardMaterial;
  whitewashWall: THREE.MeshStandardMaterial;
  hotelStone: THREE.MeshStandardMaterial;
  slateRoof: THREE.MeshStandardMaterial;
  windowGlow: THREE.MeshStandardMaterial;
  primaryRoad: THREE.MeshStandardMaterial;
  countryLane: THREE.MeshStandardMaterial;
  footpath: THREE.MeshStandardMaterial;
  pierTimber: THREE.MeshStandardMaterial;
  weatheredDeck: THREE.MeshStandardMaterial;
  dryStoneWall: THREE.MeshStandardMaterial;
  railSteel: THREE.MeshStandardMaterial;
  trunkMat: THREE.MeshStandardMaterial;
  foliageMat: THREE.MeshStandardMaterial;
  waterMat: THREE.MeshStandardMaterial;
  waterUniforms: { uTime: { value: number }; shoreMap: { value: THREE.DataTexture | null } };
  terrainMat: THREE.MeshStandardMaterial;
}

export interface BuiltChunkResult {
  key: string;
  group: THREE.Group;
  colliders: Array<{ minX: number; maxX: number; minZ: number; maxZ: number; topY: number; isRoof: boolean; outline: Array<[number, number]> }>;
  roadDecks: Array<{ ax: number; az: number; bx: number; bz: number; ay: number; by: number; halfWidth: number }>;
  pierDecks: Array<{ outline: Array<[number, number]>; y: number }>;
  grindSegments: Array<{ ax: number; az: number; bx: number; bz: number; y: number }>;
  updateSignage: (x: number, z: number, labels: boolean) => void;
  dispose: () => void;
}

export function createWorldMaterials(
  textures: ProceduralTextureSet,
  surfaces: Awaited<ReturnType<typeof loadBuildingSurfaces>>,
): WorldMaterials {
  const stoneWall = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.slateStoneMap,
    bumpMap: textures.slateStoneBump,
    bumpScale: 0.08,
    roughness: 0.85,
    metalness: 0.05,
    ...(surfaces && { ...surfaces.wall, bumpMap: null, normalScale: new THREE.Vector2(0.75, 0.75) }),
  });

  const whitewashWall = new THREE.MeshStandardMaterial({
    color: 0xf3efe6,
    bumpMap: textures.slateStoneBump,
    bumpScale: 0.03,
    roughness: 0.82,
    metalness: 0.02,
  });

  const hotelStone = new THREE.MeshStandardMaterial({
    color: 0xd6cfc2,
    map: textures.slateStoneMap,
    bumpMap: textures.slateStoneBump,
    bumpScale: 0.05,
    roughness: 0.78,
    metalness: 0.06,
    ...(surfaces && { ...surfaces.wall, bumpMap: null, normalScale: new THREE.Vector2(0.75, 0.75) }),
  });

  const slateRoof = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.slateRoofMap,
    roughness: 0.52,
    metalness: 0.16,
    ...(surfaces && { ...surfaces.roof, roughness: 0.93, metalness: 0 }),
  });

  const windowGlow = new THREE.MeshStandardMaterial({
    color: 0x334155,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.15,
    roughness: 0.18,
    metalness: 0.6,
  });

  const primaryRoad = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.roadTarmacMap,
    roughness: 0.74,
    metalness: 0.06,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });

  const countryLane = new THREE.MeshStandardMaterial({
    color: 0x4b5563,
    roughness: 0.88,
    metalness: 0.02,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });

  const footpath = new THREE.MeshStandardMaterial({
    color: 0xa89476,
    roughness: 0.94,
    metalness: 0.0,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });

  const pierTimber = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.timberPlankMap,
    roughness: 0.78,
    metalness: 0.04,
  });
  const weatheredDeck = pierTimber.clone();
  if (surfaces) {
    Object.assign(weatheredDeck, surfaces.deck);
    weatheredDeck.color.set(0xa09a8e);
    weatheredDeck.normalScale.setScalar(.7);
  }

  const dryStoneWall = new THREE.MeshStandardMaterial({
    color: 0xd1d5db,
    map: textures.slateStoneMap,
    bumpMap: textures.slateStoneBump,
    bumpScale: 0.1,
    roughness: 0.9,
    metalness: 0.02,
  });

  const railSteel = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.25,
    metalness: 0.85,
  });

  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x5c4028,
    roughness: 0.92,
  });

  const foliageMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.82,
    metalness: 0.02,
  });

  const terrainMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.grassTerrainMap,
    vertexColors: true,
    roughness: 0.9,
    metalness: 0.02,
  });

  // Animated Lake Windermere Water Material using MeshStandardMaterial + onBeforeCompile
  const waterUniforms: WorldMaterials['waterUniforms'] = { uTime: { value: 0 }, shoreMap: { value: null } };
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x1c3940,
    roughness: 0.29,
    metalness: 0.19,
    transparent: true,
    opacity: 0.9,
  });
  waterMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = waterUniforms.uTime;
    shader.uniforms.shoreMap = waterUniforms.shoreMap;
    shader.uniforms.shoreBounds = { value: new THREE.Vector4(...WATERHEAD_WATER_BOUNDS) };
    shader.vertexShader =
      `uniform float uTime;\nvarying vec3 vWorldPos;\n` +
      shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
        `,
      );
    shader.fragmentShader =
      `uniform float uTime;\nuniform sampler2D shoreMap;\nuniform vec4 shoreBounds;\nvarying vec3 vWorldPos;\n` +
      shader.fragmentShader.replace(
        '#include <color_fragment>',
        `
        #include <color_fragment>
        float shimmer = sin(vWorldPos.x * 0.14 + vWorldPos.z * 0.09 + uTime * 1.6) *
                        cos(vWorldPos.x * 0.07 - vWorldPos.z * 0.18 - uTime * 1.3);
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float grazing = pow(1.0 - clamp(viewDir.y, 0.0, 1.0), 4.0);
        vec3 reflectedSky = mix(vec3(.090,.151,.167),vec3(.27,.37,.39),
                                .5 + .5*sin(vWorldPos.x*.061 + vWorldPos.z*.098 + shimmer*.45));
        vec2 shoreUv = (vWorldPos.xz-shoreBounds.xy)/shoreBounds.zw;
        float inBounds = step(0.0,shoreUv.x)*step(shoreUv.x,1.0)*step(0.0,shoreUv.y)*step(shoreUv.y,1.0);
        float proximity = texture2D(shoreMap,shoreUv).r;
        float shallows = inBounds*(1.0-smoothstep(.0,.50,proximity));
        diffuseColor.rgb = mix(diffuseColor.rgb,vec3(.106,.104,.060),shallows*.77);
        diffuseColor.rgb = mix(diffuseColor.rgb, reflectedSky, grazing * .73);
        diffuseColor.rgb += vec3(0.003, 0.008, 0.010) * shimmer;
        `,
      ).replace(
        '#include <normal_fragment_maps>',
        `
        #include <normal_fragment_maps>
        vec2 wave = vec2(
          cos(vWorldPos.x * 1.24 + vWorldPos.z * 0.67 + uTime * 1.55),
          sin(vWorldPos.z * 1.65 - vWorldPos.x * 1.01 - uTime * 1.1)
        );
        wave += vec2(sin(vWorldPos.z*2.97+uTime*1.96),cos(vWorldPos.x*3.83-uTime*1.6))*.37;
        normal = normalize(normal + mat3(viewMatrix) * vec3(wave.x, 0.0, wave.y) * 0.036);
        `,
      );
  };

  return {
    stoneWall,
    whitewashWall,
    hotelStone,
    slateRoof,
    windowGlow,
    primaryRoad,
    countryLane,
    footpath,
    pierTimber,
    weatheredDeck,
    dryStoneWall,
    railSteel,
    trunkMat,
    foliageMat,
    waterMat,
    waterUniforms,
    terrainMat,
  };
}

function coordinateAxis(min: number, max: number, segments: number): number[] {
  return Array.from({ length: segments + 1 }, (_, i) => min + (max - min) * i / segments);
}

function insertDetail(coarse: number[], fine: number[]): number[] {
  return [
    ...coarse.filter(value => value < fine[0]),
    ...fine,
    ...coarse.filter(value => value > fine[fine.length - 1]),
  ];
}

function terrainGeometry(terrain: TerrainGridData | null): THREE.BufferGeometry {
  const coarseX = coordinateAxis(terrain?.minX ?? -3500, terrain?.maxX ?? 5000, 150);
  const coarseZ = coordinateAxis(terrain?.minZ ?? -3000, terrain?.maxZ ?? 17500, 260);
  const detail = terrain?.detail;
  const fineX = detail
    ? insertDetail(coarseX, coordinateAxis(detail.minX, detail.maxX, detail.cols - 1))
    : coarseX;
  const rows = detail
    ? insertDetail(coarseZ, coordinateAxis(detail.minZ, detail.maxZ, detail.rows - 1))
    : coarseZ;
  const positions: number[] = [];
  const indices: number[] = [];
  const uv: number[] = [];
  let previousX: number[] = [];
  let previousStart = 0;
  for (const z of rows) {
    const start = positions.length / 3;
    const axis = detail && z >= detail.minZ && z <= detail.maxZ ? fineX : coarseX;
    for (const x of axis) {
      positions.push(x, 0, z);
      uv.push((x - coarseX[0]) / (coarseX.at(-1)! - coarseX[0]),
        (coarseZ.at(-1)! - z) / (coarseZ.at(-1)! - coarseZ[0]));
    }
    // Stitch adjacent rows by advancing whichever side has the next vertex.
    // The detail boundary shares vertices with the coarse mesh, avoiding cracks.
    let a = 0;
    let b = 0;
    while (previousX.length && (a + 1 < previousX.length || b + 1 < axis.length)) {
      if ((previousX[a + 1] ?? Infinity) <= (axis[b + 1] ?? Infinity)) {
        indices.push(previousStart + a, start + b, previousStart + ++a);
      } else {
        indices.push(previousStart + a, start + b, start + ++b);
      }
    }
    previousX = axis;
    previousStart = start;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  return geometry;
}

function lakeGeometry(lake: LakeData | null): THREE.ShapeGeometry {
  const shapes = (lake?.outerRings ?? []).map(ring => {
    const shape = new THREE.Shape(ring.map(([x, z]) => new THREE.Vector2(x, -z)));
    for (const island of lake?.innerRings ?? []) {
      if (island.length < 3 || !pointInRing(island[0][0], island[0][1], ring)) continue;
      shape.holes.push(new THREE.Path(island.map(([x, z]) => new THREE.Vector2(x, -z))));
    }
    return shape;
  });
  const geometry = new THREE.ShapeGeometry(shapes);
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

export function buildTerrainAndWaterMeshes(
  terrain: TerrainGridData | null,
  lake: LakeData | null,
  materials: WorldMaterials,
): { terrainMesh: THREE.Group; waterMesh: THREE.Mesh } {
  const geo = terrainGeometry(terrain);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const cShore = new THREE.Color(0x8c8470);
  const cValley = new THREE.Color(0x567a42);
  const cHeather = new THREE.Color(0x6e5f3e);
  const cCrag = new THREE.Color(0x666e75);
  const cBed = new THREE.Color(0x1f3640);
  const tmpColor = new THREE.Color();
  const shoreBounds = new THREE.Box2();
  for (const ring of lake?.outerRings ?? []) {
    for (const [x, z] of ring) shoreBounds.expandByPoint(new THREE.Vector2(x, z));
  }

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    let h = sampleTerrainHeight(terrain, x, z);
    const inLake = x >= shoreBounds.min.x && x <= shoreBounds.max.x
      && z >= shoreBounds.min.y && z <= shoreBounds.max.y && isPointInLake(lake, x, z);

    if (inLake) {
      // Carve natural lakebed below 0m water surface
      h = Math.min(-2.8, h - 4.0);
      tmpColor.copy(cBed);
    } else {
      // Keep dry land subtly above water datum so shoreline is crisp
      h = Math.max(0.45, h);
      if (h < 3.2) {
        tmpColor.copy(cShore).lerp(cValley, (h - 0.35) / 2.85);
      } else if (h < 75) {
        tmpColor.copy(cValley).lerp(cHeather, Math.max(0, (h - 25) / 50));
      } else if (h < 185) {
        tmpColor.copy(cHeather).lerp(cCrag, (h - 75) / 110);
      } else {
        tmpColor.copy(cCrag);
      }
    }
    pos.setY(i, h);
    colors[i * 3] = tmpColor.r;
    colors[i * 3 + 1] = tmpColor.g;
    colors[i * 3 + 2] = tmpColor.b;
  }

  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();

  // Keep the shared vertex attributes and give each index tile a tight culling sphere.
  const terrainMesh = new THREE.Group();
  const tiles = new Map<string, { indices: number[]; box: THREE.Box3 }>();
  const index = geo.index!;
  const corner = new THREE.Vector3();
  for (let i = 0; i < index.count; i += 3) {
    const a = index.getX(i), b = index.getX(i + 1), c = index.getX(i + 2);
    const x = (pos.getX(a) + pos.getX(b) + pos.getX(c)) / 3;
    const z = (pos.getZ(a) + pos.getZ(b) + pos.getZ(c)) / 3;
    const key = `${Math.floor(x / 960)}:${Math.floor(z / 960)}`;
    const tile = tiles.get(key) ?? { indices: [], box: new THREE.Box3() };
    tile.indices.push(a, b, c);
    for (const vertex of [a, b, c]) {
      tile.box.expandByPoint(corner.fromBufferAttribute(pos, vertex));
    }
    tiles.set(key, tile);
  }
  for (const tile of tiles.values()) {
    const patch = new THREE.BufferGeometry();
    for (const [name, attribute] of Object.entries(geo.attributes)) patch.setAttribute(name, attribute);
    patch.setIndex(tile.indices);
    patch.boundingBox = tile.box;
    patch.boundingSphere = tile.box.getBoundingSphere(new THREE.Sphere());
    const mesh = new THREE.Mesh(patch, materials.terrainMat);
    mesh.receiveShadow = true;
    terrainMesh.add(mesh);
  }
  geo.dispose();

  materials.waterUniforms.shoreMap.value = buildWaterheadShoreDistance(lake);
  const waterMesh = new THREE.Mesh(lakeGeometry(lake), materials.waterMat);
  waterMesh.receiveShadow = true;

  return { terrainMesh, waterMesh };
}

function resampleRoad(
  points: Array<[number, number]>,
  detail: TerrainGridData['detail'],
  margin: number,
): Array<[number, number]> {
  if (!detail) return points;
  const result: Array<[number, number]> = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const [ax, az] = points[i - 1];
    const [bx, bz] = points[i];
    const overlaps = Math.min(ax, bx) <= detail.maxX + margin && Math.max(ax, bx) >= detail.minX - margin
      && Math.min(az, bz) <= detail.maxZ + margin && Math.max(az, bz) >= detail.minZ - margin;
    const steps = overlaps ? Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / 4)) : 1;
    for (let j = 1; j < steps; j++) {
      result.push([ax + (bx - ax) * j / steps, az + (bz - az) * j / steps]);
    }
    result.push(points[i]);
  }
  return result;
}

function buildPierDeck(points: Array<[number, number]>, y: number): THREE.BufferGeometry | null {
  const first = points[0];
  const last = points.at(-1);
  if (points.length < 4 || !last || first[0] !== last[0] || first[1] !== last[1]) return null;
  const outline = points.slice(0, -1).map(([x, z]) => new THREE.Vector2(x, -z));
  const shape = new THREE.Shape(outline);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.24, bevelEnabled: false });
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, y - 0.24, 0);
  // Use world-space metres for a consistent deck grain scale across pier outlines.
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 0.28, uv.getY(i) * 0.28);
  return geometry;
}

function buildRoadRibbonGeometry(
  pts: Array<[number, number]>,
  halfWidth: number,
  terrain: TerrainGridData | null,
  yOffset: number,
  followDetail = true,
  deck?: { from: number; to: number; halfWidth: number; segments: BuiltChunkResult['roadDecks'] },
): THREE.BufferGeometry | null {
  if (pts.length < 2) return null;
  if (followDetail) pts = resampleRoad(pts, terrain?.detail, halfWidth);
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  let totalLen = 0;
  const deckLength = deck ? pts.slice(1).reduce((sum, [x, z], i) =>
    sum + Math.hypot(x - pts[i][0], z - pts[i][1]), 0) : 0;
  let previousDeckY = deck?.from ?? 0;
  for (let i = 0; i < pts.length; i++) {
    const [x, z] = pts[i];
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(pts.length - 1, i + 1)];
    if (i > 0) {
      totalLen += Math.hypot(x - prev[0], z - prev[1]);
    }

    const dx = next[0] - prev[0];
    const dz = next[1] - prev[1];
    const len = Math.hypot(dx, dz) || 1;
    const rx = -dz / len;
    const rz = dx / len;

    const lx = x - rx * halfWidth;
    const lz = z - rz * halfWidth;
    const rxp = x + rx * halfWidth;
    const rzp = z + rz * halfWidth;

    let ly = Math.max(0.42, sampleTerrainHeight(terrain, lx, lz)) + yOffset;
    let ry = Math.max(0.42, sampleTerrainHeight(terrain, rxp, rzp)) + yOffset;
    if (deck && deckLength > 0) {
      const height = THREE.MathUtils.lerp(deck.from, deck.to, totalLen / deckLength);
      if (i > 0) deck.segments.push({
        ax: prev[0], az: prev[1], bx: x, bz: z, ay: previousDeckY, by: height,
        halfWidth: deck.halfWidth,
      });
      previousDeckY = height;
      ly = ry = height;
    }

    positions.push(lx, ly, lz, rxp, ry, rzp);
    const vCoord = totalLen / (halfWidth * 2.2);
    uvs.push(0, vCoord, 1, vCoord);

    if (i < pts.length - 1) {
      const base = i * 2;
      indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function createOrientedBox(
  cx: number,
  baseY: number,
  cz: number,
  w: number,
  h: number,
  d: number,
  yaw: number,
): THREE.BufferGeometry {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(0, h / 2, 0);
  g.rotateY(yaw);
  g.translate(cx, baseY, cz);
  return g;
}

/**
 * Generates an extruded/pitched Lakeland building geometry from real OSM footprint points,
 * complete with pitched slate roof and chimney stack.
 */
function buildLakelandBuildingGeometries(
  b: BuildingFeature,
  terrain: TerrainGridData | null,
): {
  wallGeo: THREE.BufferGeometry;
  roofGeo: THREE.BufferGeometry;
  windowGeo: THREE.BufferGeometry;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number; topY: number };
} | null {
  if (b.pts.length < 3) return null;

  const baseTerrainY = Math.max(0.45, sampleTerrainHeight(terrain, b.cx, b.cz));
  // Compute oriented bounding dimensions from footprint
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const [px, pz] of b.pts) {
    if (px < minX) minX = px;
    if (px > maxX) maxX = px;
    if (pz < minZ) minZ = pz;
    if (pz > maxZ) maxZ = pz;
  }

  // Primary edge orientation from longest footprint edge
  let bestLen = 0;
  let yaw = 0;
  for (let i = 0; i < b.pts.length; i++) {
    const a = b.pts[i];
    const next = b.pts[(i + 1) % b.pts.length];
    const dx = next[0] - a[0];
    const dz = next[1] - a[1];
    const l = Math.hypot(dx, dz);
    if (l > bestLen) {
      bestLen = l;
      yaw = Math.atan2(dx, dz);
    }
  }

  // Build shape in local XZ for accurate real-world footprint extrusion
  const shape = new THREE.Shape();
  shape.moveTo(b.pts[0][0], -b.pts[0][1]);
  for (let i = 1; i < b.pts.length; i++) {
    shape.lineTo(b.pts[i][0], -b.pts[i][1]);
  }
  shape.closePath();

  const foundationDepth = 2.2;
  const wallH = Math.max(3.4, b.h - 1.6);
  const wallGeo = new THREE.ExtrudeGeometry(shape, {
    depth: wallH + foundationDepth,
    bevelEnabled: false,
  });
  wallGeo.rotateX(-Math.PI / 2);
  wallGeo.translate(b.cx, baseTerrainY - foundationDepth, b.cz);

  // Pitched Slate Roof (4-sided hipped/pyramidal cap + chimney)
  const spanX = Math.max(3.2, Math.min(28, maxX - minX));
  const spanZ = Math.max(3.2, Math.min(28, maxZ - minZ));
  const roofH = b.kind === 'historic' ? 3.2 : 1.95;

  let roofPrism: THREE.BufferGeometry;
  if (b.pts.length > 24) {
    // Approximate the cap of complex footprints without overhanging adjacent streets.
    roofPrism = new THREE.ExtrudeGeometry(shape, { depth: 0.2, bevelEnabled: false });
    roofPrism.rotateX(-Math.PI / 2);
    roofPrism.translate(b.cx, baseTerrainY + wallH, b.cz);
  } else {
    roofPrism = new THREE.ConeGeometry(Math.max(spanX, spanZ) * 0.68, roofH, 4);
    roofPrism.rotateY(Math.PI / 4 + yaw);
    roofPrism.scale(spanX / Math.max(spanX, spanZ), 1, spanZ / Math.max(spanX, spanZ));
    roofPrism.translate(b.cx, baseTerrainY + wallH + roofH * 0.5 - 0.05, b.cz);
  }

  const chimney = new THREE.BoxGeometry(0.68, 1.35, 0.68);
  chimney.translate(
    b.cx + Math.cos(yaw) * (spanX * 0.22),
    baseTerrainY + wallH + roofH * 0.65,
    b.cz - Math.sin(yaw) * (spanX * 0.22),
  );

  // Subtle exterior window band on upper wall
  const winBand = new THREE.BoxGeometry(spanX * 0.72, 0.75, spanZ * 0.72);
  winBand.rotateY(yaw);
  winBand.translate(b.cx, baseTerrainY + wallH * 0.62, b.cz);

  const roofCap = roofPrism.index ? roofPrism.toNonIndexed() : roofPrism;
  const chimneyFaces = chimney.toNonIndexed();
  const roofMerged = mergeGeometries([roofCap, chimneyFaces], false)!;
  if (roofCap !== roofPrism) roofCap.dispose();
  chimneyFaces.dispose();
  roofPrism.dispose();
  chimney.dispose();

  const toNonIdx = (g: THREE.BufferGeometry) => (g.index ? g.toNonIndexed() : g);

  return {
    wallGeo: toNonIdx(wallGeo),
    roofGeo: toNonIdx(roofMerged),
    windowGeo: toNonIdx(winBand),
    bounds: {
      minX: b.cx + minX,
      maxX: b.cx + maxX,
      minZ: b.cz + minZ,
      maxZ: b.cz + maxZ,
      topY: baseTerrainY + wallH,
    },
  };
}

/**
 * Builds a single 500m x 500m spatial chunk with batched building geometries,
 * road ribbons, dry-stone walls, piers, and instanced Lakeland trees.
 */
export function buildChunkGroup(
  chunk: WorldChunkData,
  terrain: TerrainGridData | null,
  lake: LakeData | null,
  materials: WorldMaterials,
  buildingAssets: ReadonlyMap<number, THREE.Object3D>,
): BuiltChunkResult {
  const group = new THREE.Group();
  const isWaterhead = chunk.key === '0_-1' && Boolean(terrain?.detail);
  const waterfront = isWaterhead ? buildWaterfrontDetails(
    (x, z) => Math.max(.45, sampleTerrainHeight(terrain, x, z)), (x, z) => isPointInLake(lake, x, z),
  ) : null;
  if (waterfront) group.add(waterfront.group);
  const disposables: THREE.BufferGeometry[] = [];
  const colliders: BuiltChunkResult['colliders'] = [];
  const grindSegments: BuiltChunkResult['grindSegments'] = [];

  const stoneWalls: THREE.BufferGeometry[] = [];
  const whiteWalls: THREE.BufferGeometry[] = [];
  const hotelWalls: THREE.BufferGeometry[] = [];
  const roofs: THREE.BufferGeometry[] = [];
  const windows: THREE.BufferGeometry[] = [];

  for (const b of chunk.buildings) {
    const built = buildLakelandBuildingGeometries(b, terrain);
    if (!built) continue;
    const asset = buildingAssets.get(b.id);
    if (asset) {
      const model = asset.clone();
      const authoredGround = buildingAssetMetadata.find(entry => entry.buildingId === b.id)?.groundElevationM;
      const ground = authoredGround == null ? sampleTerrainHeight(terrain, b.cx, b.cz)
        : authoredGround - (terrain?.lakeDatumM ?? 39);
      model.position.set(b.cx, Math.max(.45, ground), b.cz);
      model.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });
      group.add(model);
      built.wallGeo.dispose();
      built.roofGeo.dispose();
      built.windowGeo.dispose();
    } else if (b.kind === 'shop' || b.kind === 'hotel') {
      hotelWalls.push(built.wallGeo);
    } else if (b.zone === 'hawkshead' || b.zone === 'far_sawrey' || b.zone === 'near_sawrey') {
      whiteWalls.push(built.wallGeo);
    } else {
      stoneWalls.push(built.wallGeo);
    }
    if (!asset) {
      roofs.push(built.roofGeo);
      windows.push(built.windowGeo);
    }
    if (b.id !== 658735202 || !asset) colliders.push({ ...built.bounds, isRoof: b.h < 9.5, outline: b.pts.map(([x, z]) => [x + b.cx, z + b.cz]) });
  }

  if (chunk.key === '0_-4') {
    const cross = amblesideNavigation.stops.find(stop => stop.id === 'market');
    const prototype = buildingAssets.get(423190096);
    if (cross && prototype) {
      const [x, z] = cross.point;
      const model = prototype.clone();
      model.position.set(x, sampleTerrainHeight(terrain, x, z) + .12, z);
      group.add(model);
    }
  }

  const addBatch = (geos: THREE.BufferGeometry[], mat: THREE.Material, castShadow: boolean) => {
    if (geos.length === 0) return;
    const normalized = geos.map((orig) => {
      const g = orig.index ? orig.toNonIndexed() : orig;
      if (g !== orig) orig.dispose();
      if (!g.attributes.uv) {
        const count = g.attributes.position.count;
        g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(count * 2), 2));
      }
      return g;
    });
    const merged = mergeGeometries(normalized, false);
    normalized.forEach((g) => g.dispose());
    if (!merged) return;
    disposables.push(merged);
    const mesh = new THREE.Mesh(merged, mat);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
    group.add(mesh);
  };

  addBatch(stoneWalls, materials.stoneWall, true);
  addBatch(whiteWalls, materials.whitewashWall, true);
  addBatch(hotelWalls, materials.hotelStone, true);
  addBatch(roofs, materials.slateRoof, true);
  addBatch(windows, materials.windowGlow, false);

  // Roads & Footpaths
  const primaryGeos: THREE.BufferGeometry[] = [];
  const laneGeos: THREE.BufferGeometry[] = [];
  const pathGeos: THREE.BufferGeometry[] = [];
  const railGeos: THREE.BufferGeometry[] = [];

  const roadDecks: BuiltChunkResult['roadDecks'] = [];
  for (const r of chunk.roads) {
    if (r.kind === 'ferry' || (isWaterhead && WATERHEAD_SIDEWALKS.has(r.id))) continue;
    const arterial = r.kind === 'primary' || r.kind === 'secondary';
    const lane = r.kind === 'lane';
    const rail = r.kind === 'railway';
    const halfWidth = r.widthM ? r.widthM / 2
      : r.kind === 'primary' ? 4.4 : arterial ? 3.4 : lane ? 2.6 : rail ? 1.5 : r.sidewalk ? .85 : 1.35;
    const offset = arterial ? .12 : lane ? .09 : rail ? .14 : r.sidewalk ? .145 : .06;
    const start = r.pts[0];
    const end = r.pts.at(-1);
    const deck = r.bridge && !rail && start && end ? {
      from: Math.max(.45, sampleTerrainHeight(terrain, ...start)) + offset,
      to: Math.max(.45, sampleTerrainHeight(terrain, ...end)) + offset,
      halfWidth,
      segments: roadDecks,
    } : undefined;
    const geometry = buildRoadRibbonGeometry(r.pts, halfWidth, terrain, offset, true, deck);
    if (geometry) (arterial ? primaryGeos : lane ? laneGeos : rail ? railGeos : pathGeos).push(geometry);
    if (rail) {
      for (let i = 0; i < r.pts.length - 1; i++) {
        const [ax, az] = r.pts[i];
        const [bx, bz] = r.pts[i + 1];
        const y = Math.max(0.5, sampleTerrainHeight(terrain, ax, az)) + 0.35;
        grindSegments.push({ ax, az, bx, bz, y });
      }
    }
  }

  const siteSurfaces = amblesideSurfaces[chunk.key as keyof typeof amblesideSurfaces] ?? [];
  for (const site of siteSurfaces) {
    laneGeos.push(groundSurface(site.points, (x, z) => sampleTerrainHeight(terrain, x, z), .045));
  }

  addBatch(primaryGeos, materials.primaryRoad, false);
  addBatch(laneGeos, materials.countryLane, false);
  addBatch(pathGeos, materials.footpath, false);
  addBatch(railGeos, materials.railSteel, false);

  // Dry-stone walls (also grindable!)
  const wallGeos: THREE.BufferGeometry[] = [];
  for (const w of chunk.walls) {
    for (let i = 0; i < w.pts.length - 1; i++) {
      const [ax, az] = w.pts[i];
      const [bx, bz] = w.pts[i + 1];
      const len = Math.hypot(bx - ax, bz - az);
      if (len < 1.5 || len > 160) continue;
      const mx = (ax + bx) * 0.5;
      const mz = (az + bz) * 0.5;
      if (isPointInLake(lake, mx, mz)) continue;
      const my = Math.max(0.45, sampleTerrainHeight(terrain, mx, mz));
      const yaw = Math.atan2(bx - ax, bz - az);
      wallGeos.push(createOrientedBox(mx, my - 0.3, mz, 0.5, 1.25, len, yaw).toNonIndexed());
      grindSegments.push({ ax, az, bx, bz, y: my + 0.95 });
    }
  }
  addBatch(wallGeos, materials.dryStoneWall, true);

  // Wooden Piers & Jetties (crisp 2.5m-wide jetties with timber support pilings)
  const pierGeos: THREE.BufferGeometry[] = [];
  const pierDecks: BuiltChunkResult['pierDecks'] = [];
  for (const p of chunk.piers) {
    const detail = terrain?.detail;
    const surveyed = detail && p.pts.some(([x, z]) =>
      x > detail.minX && x < detail.maxX && z > detail.minZ && z < detail.maxZ);
    // The deck elevation is a game approximation independent of unsurveyed lakebed heights.
    const deckHeight = 1.32;
    const deck = surveyed ? buildPierDeck(p.pts, deckHeight) : null;
    if (deck) pierDecks.push({ outline: p.pts, y: deckHeight });
    const geometry = deck ?? buildRoadRibbonGeometry(p.pts, 1.25, terrain, 0.55, false);
    if (geometry) pierGeos.push(geometry);
    for (let i = 0; i < p.pts.length; i++) {
      const [px, pz] = p.pts[i];
      const py = deck ? deckHeight : Math.max(0.45, sampleTerrainHeight(terrain, px, pz)) + 0.55;
      pierGeos.push(createOrientedBox(px, py - 2.0, pz, 0.22, 2.05, 0.22, 0).toNonIndexed());
      if (i < p.pts.length - 1) {
        grindSegments.push({
          ax: px,
          az: pz,
          bx: p.pts[i + 1][0],
          bz: p.pts[i + 1][1],
          y: py + 0.15,
        });
      }
    }
  }
  addBatch(pierGeos, isWaterhead ? materials.weatheredDeck : materials.pierTimber, true);

  // Fast squared-distance exclusion check so trees NEVER spawn on roads, paths, piers, or buildings
  const distSqToSeg = (
    px: number,
    pz: number,
    ax: number,
    az: number,
    bx: number,
    bz: number,
  ): number => {
    const dx = bx - ax;
    const dz = bz - az;
    const lenSq = dx * dx + dz * dz;
    if (lenSq < 1e-6) return (px - ax) * (px - ax) + (pz - az) * (pz - az);
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / lenSq));
    const projX = ax + t * dx;
    const projZ = az + t * dz;
    return (px - projX) * (px - projX) + (pz - projZ) * (pz - projZ);
  };

  const isBlockedForTree = (tx: number, tz: number): boolean => {
    for (const c of colliders) {
      if (tx >= c.minX - 2.6 && tx <= c.maxX + 2.6 && tz >= c.minZ - 2.6 && tz <= c.maxZ + 2.6) {
        return true;
      }
    }
    for (const r of chunk.roads) {
      const halfW =
        r.kind === 'primary'
          ? 4.4
          : r.kind === 'secondary'
            ? 3.4
            : r.kind === 'lane'
              ? 2.6
              : 1.8;
      const clearSq = (halfW + 3.4) * (halfW + 3.4);
      for (let i = 0; i < r.pts.length - 1; i++) {
        if (distSqToSeg(tx, tz, r.pts[i][0], r.pts[i][1], r.pts[i + 1][0], r.pts[i + 1][1]) < clearSq) {
          return true;
        }
      }
    }
    for (const p of chunk.piers) {
      const clearSq = 18;
      for (let i = 0; i < p.pts.length - 1; i++) {
        if (distSqToSeg(tx, tz, p.pts[i][0], p.pts[i][1], p.pts[i + 1][0], p.pts[i + 1][1]) < clearSq) {
          return true;
        }
      }
    }
    return false;
  };

  // Instanced Lakeland Woodland Trees (conifers + broadleaf oaks)
  const conifers: Array<{ x: number; y: number; z: number; s: number; tint: number }> = [];
  const broadleafs: Array<{ x: number; y: number; z: number; s: number; tint: number }> = [];
  let seed = ((chunk.cx * 92821) ^ (chunk.cz * 53987)) >>> 0;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const pushTree = (tx: number, tz: number, ty: number, s: number, tint: number) => {
    const item = { x: tx, y: ty, z: tz, s, tint };
    if (tint > 0.45) {
      conifers.push(item);
    } else {
      broadleafs.push(item);
    }
  };

  for (const wl of chunk.woodlands) {
    const count = Math.min(18, Math.max(4, Math.floor(wl.pts.length * 1.4)));
    for (let i = 0; i < count; i++) {
      const tx = wl.cx + (rand() - 0.5) * 64;
      const tz = wl.cz + (rand() - 0.5) * 64;
      if (isPointInLake(lake, tx, tz)) continue;
      const ty = sampleTerrainHeight(terrain, tx, tz);
      if (ty < 0.8 || ty > 240) continue;
      if (isBlockedForTree(tx, tz)) continue;
      pushTree(tx, tz, ty, 0.8 + rand() * 0.55, rand());
    }
  }

  // Scatter additional fellside copses away from roads & buildings
  const chunkMinX = chunk.cx * 500;
  const chunkMinZ = chunk.cz * 500;
  const extraNeeded = Math.max(0, 26 - conifers.length - broadleafs.length);
  for (let i = 0; i < extraNeeded * 2 && conifers.length + broadleafs.length < 28; i++) {
    const tx = chunkMinX + 25 + rand() * 450;
    const tz = chunkMinZ + 25 + rand() * 450;
    if (isPointInLake(lake, tx, tz)) continue;
    const ty = sampleTerrainHeight(terrain, tx, tz);
    if (ty < 1.2 || ty > 220) continue;
    if (isBlockedForTree(tx, tz)) continue;
    pushTree(tx, tz, ty, 0.85 + rand() * 0.5, rand());
  }

  const dummy = new THREE.Object3D();
  const treeColor = new THREE.Color();

  if (conifers.length > 0) {
    const trunkGeo = new THREE.CylinderGeometry(0.16, 0.28, 2.4, 6);
    trunkGeo.translate(0, 1.2, 0);
    const tier1 = new THREE.ConeGeometry(1.7, 2.8, 7);
    tier1.translate(0, 3.0, 0);
    const tier2 = new THREE.ConeGeometry(1.25, 2.6, 7);
    tier2.translate(0, 4.5, 0);
    const crownGeo = mergeGeometries([tier1, tier2], false)!;
    tier1.dispose();
    tier2.dispose();
    disposables.push(trunkGeo, crownGeo);

    const trunks = new THREE.InstancedMesh(trunkGeo, materials.trunkMat, conifers.length);
    const crowns = new THREE.InstancedMesh(crownGeo, materials.foliageMat, conifers.length);
    crowns.castShadow = true;
    crowns.receiveShadow = true;

    conifers.forEach((tp, idx) => {
      dummy.position.set(tp.x, tp.y, tp.z);
      dummy.rotation.set(0, tp.tint * Math.PI * 2, 0);
      dummy.scale.setScalar(tp.s);
      dummy.updateMatrix();
      trunks.setMatrixAt(idx, dummy.matrix);
      crowns.setMatrixAt(idx, dummy.matrix);
      treeColor.setHSL(0.31 + tp.tint * 0.05, 0.44 + tp.tint * 0.12, 0.16 + tp.tint * 0.07);
      crowns.setColorAt(idx, treeColor);
    });
    trunks.instanceMatrix.needsUpdate = true;
    crowns.instanceMatrix.needsUpdate = true;
    if (crowns.instanceColor) crowns.instanceColor.needsUpdate = true;
    trunks.computeBoundingSphere();
    crowns.computeBoundingSphere();
    group.add(trunks, crowns);
  }

  if (broadleafs.length > 0) {
    const trunkGeo = new THREE.CylinderGeometry(0.18, 0.3, 2.2, 6);
    trunkGeo.translate(0, 1.1, 0);
    const b1 = new THREE.IcosahedronGeometry(1.45, 2);
    b1.computeVertexNormals();
    b1.translate(0, 3.3, 0);
    const b2 = new THREE.IcosahedronGeometry(1.05, 1);
    b2.computeVertexNormals();
    b2.translate(0.55, 2.9, 0.35);
    const b3 = new THREE.IcosahedronGeometry(1.12, 1);
    b3.scale(.92,1.15,.94);b3.translate(-.55,3.15,-.32);
    const crownGeo = mergeGeometries([b1, b2,b3], false)!;
    b3.dispose();
    b1.dispose();
    b2.dispose();
    disposables.push(trunkGeo, crownGeo);

    const trunks = new THREE.InstancedMesh(trunkGeo, materials.trunkMat, broadleafs.length);
    const crowns = new THREE.InstancedMesh(crownGeo, materials.foliageMat, broadleafs.length);
    crowns.castShadow = true;
    crowns.receiveShadow = true;

    broadleafs.forEach((tp, idx) => {
      dummy.position.set(tp.x, tp.y, tp.z);
      dummy.rotation.set(0, tp.tint * Math.PI * 2, 0);
      dummy.scale.setScalar(tp.s);
      dummy.updateMatrix();
      trunks.setMatrixAt(idx, dummy.matrix);
      crowns.setMatrixAt(idx, dummy.matrix);
      treeColor.setHSL(0.24 + tp.tint * 0.08, 0.42 + tp.tint * 0.14, 0.19 + tp.tint * 0.08);
      crowns.setColorAt(idx, treeColor);
    });
    trunks.instanceMatrix.needsUpdate = true;
    crowns.instanceMatrix.needsUpdate = true;
    if (crowns.instanceColor) crowns.instanceColor.needsUpdate = true;
    trunks.computeBoundingSphere();
    crowns.computeBoundingSphere();
    group.add(trunks, crowns);
  }

  const signage = buildSignage(chunk, terrain, lake);
  group.add(signage.group);
  return {
    key: chunk.key,
    group,
    updateSignage: signage.update,
    colliders,
    roadDecks,
    pierDecks,
    grindSegments,
    dispose: () => {
      disposables.forEach((g) => g.dispose());
      waterfront?.dispose();
      signage.dispose();
    },
  };
}
