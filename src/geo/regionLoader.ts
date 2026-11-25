import type {
  LakeData,
  RegionManifest,
  TerrainGridData,
  WorldChunkData,
} from '../types/game';
import { isPointInLake, sampleTerrainHeight } from './projection';

/**
 * Modular Region & Chunk Streaming Manager.
 * Loads region metadata, terrain elevation grid, and lake shorelines once,
 * then dynamically loads/caches only the 500m x 500m world chunks near the camera/player.
 */
export class RegionManager {
  public readonly regionId: string;
  public manifest: RegionManifest | null = null;
  public terrain: TerrainGridData | null = null;
  public lake: LakeData | null = null;

  private chunkCache = new Map<string, WorldChunkData>();
  private loadingChunks = new Map<string, Promise<WorldChunkData | null>>();
  private availableChunkSet = new Set<string>();

  constructor(regionId = 'windermere') {
    this.regionId = regionId;
  }

  public async initialize(): Promise<void> {
    const base = `/regions/${this.regionId}`;
    const [manifestRes, terrainRes, lakeRes] = await Promise.all([
      fetch(`${base}/manifest.json`),
      fetch(`${base}/terrain.json`),
      fetch(`${base}/lake.json`),
    ]);

    if (!manifestRes.ok || !terrainRes.ok || !lakeRes.ok) {
      throw new Error(`Failed to load geographic dataset for region "${this.regionId}"`);
    }

    this.manifest = (await manifestRes.json()) as RegionManifest;
    this.terrain = (await terrainRes.json()) as TerrainGridData;
    this.lake = (await lakeRes.json()) as LakeData;
    this.availableChunkSet = new Set(this.manifest.availableChunks);
  }

  public getChunkSize(): number {
    return this.manifest?.chunkSize ?? 500;
  }

  public getTerrainHeight(x: number, z: number): number {
    return sampleTerrainHeight(this.terrain, x, z);
  }

  public isInWater(x: number, z: number): boolean {
    return isPointInLake(this.lake, x, z);
  }

  public getChunkKeyForWorld(x: number, z: number): [number, number, string] {
    const size = this.getChunkSize();
    const cx = Math.floor(x / size);
    const cz = Math.floor(z / size);
    return [cx, cz, `${cx}_${cz}`];
  }

  public getNearestSettlement(x: number, z: number): string {
    if (!this.manifest) return 'Windermere';
    let bestName = 'Windermere';
    let bestDist = Infinity;
    for (const s of this.manifest.settlements) {
      const d = Math.hypot(s.x - x, s.z - z);
      if (d < bestDist) {
        bestDist = d;
        bestName = s.name;
      }
    }
    return bestName;
  }

  public async ensureChunk(cx: number, cz: number): Promise<WorldChunkData> {
    const key = `${cx}_${cz}`;
    const cached = this.chunkCache.get(key);
    if (cached) return cached;

    if (!this.availableChunkSet.has(key)) {
      const procedural = this.createProceduralFallbackChunk(cx, cz);
      this.chunkCache.set(key, procedural);
      return procedural;
    }

    const inflight = this.loadingChunks.get(key);
    if (inflight) {
      const res = await inflight;
      return res ?? this.createProceduralFallbackChunk(cx, cz);
    }

    const promise = (async () => {
      try {
        const res = await fetch(`/regions/${this.regionId}/chunks/${key}.json`);
        if (!res.ok) return null;
        const data = (await res.json()) as WorldChunkData;
        this.chunkCache.set(key, data);
        return data;
      } catch {
        return null;
      } finally {
        this.loadingChunks.delete(key);
      }
    })();

    this.loadingChunks.set(key, promise);
    const loaded = await promise;
    return loaded ?? this.createProceduralFallbackChunk(cx, cz);
  }

  public evictDistantChunks(centerCx: number, centerCz: number, keepRadius = 3): string[] {
    const evicted: string[] = [];
    for (const [key, chunk] of this.chunkCache.entries()) {
      if (
        Math.abs(chunk.cx - centerCx) > keepRadius ||
        Math.abs(chunk.cz - centerCz) > keepRadius
      ) {
        this.chunkCache.delete(key);
        evicted.push(key);
      }
    }
    return evicted;
  }

  /**
   * Deterministic procedural rural Lakeland chunk for areas between surveyed OSM village tiles
   * (stone walls, copses, farmsteads). Never labeled as surveyed data.
   */
  private createProceduralFallbackChunk(cx: number, cz: number): WorldChunkData {
    const size = this.getChunkSize();
    const minX = cx * size;
    const minZ = cz * size;
    let seed = ((cx * 73856093) ^ (cz * 19349663)) >>> 0;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    const buildings: WorldChunkData['buildings'] = [];
    const walls: WorldChunkData['walls'] = [];
    const woodlands: WorldChunkData['woodlands'] = [];

    // Add 2-4 stone farmhouses/barns on dry land outside the lake
    for (let i = 0; i < 4; i++) {
      const bx = minX + 60 + rand() * (size - 120);
      const bz = minZ + 60 + rand() * (size - 120);
      const h = this.getTerrainHeight(bx, bz);
      if (!this.isInWater(bx, bz) && h > 1.5 && h < 190) {
        const w = 6 + rand() * 5;
        const d = 4.5 + rand() * 3.5;
        buildings.push({
          id: -(Math.abs(cx * 1000 + cz * 10 + i) + 1),
          kind: i === 0 ? 'cottage' : 'boathouse',
          cx: bx,
          cz: bz,
          h: 5.5 + rand() * 2.5,
          pts: [
            [-w / 2, -d / 2],
            [w / 2, -d / 2],
            [w / 2, d / 2],
            [-w / 2, d / 2],
          ],
        });
      }
    }

    // Add dry-stone boundary wall segments on gentle slopes
    for (let i = 0; i < 3; i++) {
      const wx = minX + 40 + rand() * (size - 80);
      const wz = minZ + 40 + rand() * (size - 80);
      const ang = rand() * Math.PI;
      const len = 35 + rand() * 45;
      const ex = wx + Math.cos(ang) * len;
      const ez = wz + Math.sin(ang) * len;
      if (!this.isInWater(wx, wz) && !this.isInWater(ex, ez)) {
        walls.push({
          id: -(Math.abs(cx * 500 + cz * 20 + i) + 1),
          pts: [
            [wx, wz],
            [ex, ez],
          ],
        });
      }
    }

    // Add woodland copses
    for (let i = 0; i < 2; i++) {
      const fx = minX + 80 + rand() * (size - 160);
      const fz = minZ + 80 + rand() * (size - 160);
      if (!this.isInWater(fx, fz)) {
        const r = 28 + rand() * 22;
        woodlands.push({
          id: -(Math.abs(cx * 300 + cz * 30 + i) + 1),
          cx: fx,
          cz: fz,
          pts: [
            [fx - r, fz - r],
            [fx + r, fz - r],
            [fx + r, fz + r],
            [fx - r, fz + r],
          ],
        });
      }
    }

    return {
      key: `${cx}_${cz}`,
      cx,
      cz,
      buildings,
      roads: [],
      walls,
      piers: [],
      woodlands,
    };
  }
}
