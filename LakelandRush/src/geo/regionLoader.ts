import type {
  LakeData,
  RegionManifest,
  RoadFeature,
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
  private roadTiles: Record<string, RoadFeature[]> = {};
  private roadReplacements = new Set<number>();
  private availableChunkSet = new Set<string>();

  constructor(regionId = 'windermere') {
    this.regionId = regionId;
  }

  public async initialize(): Promise<void> {
    const base = `${import.meta.env.BASE_URL}regions/${this.regionId}`;
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
    if (this.regionId === 'windermere' && !this.terrain.detail) {
      const surveyRes = await fetch(`${base}/ambleside-terrain.json`);
      if (surveyRes.ok) {
        const survey = await surveyRes.json();
        if (survey.schemaVersion !== 1 || survey.lakeDatumM !== this.terrain.lakeDatumM) {
          throw new Error('Incompatible Ambleside terrain survey');
        }
        this.terrain.detail = survey.detail;
      }
    }
    this.availableChunkSet = new Set(this.manifest.availableChunks);
    if (this.regionId === 'windermere') {
      const response = await fetch(`${import.meta.env.BASE_URL}world-core/road-tiles-v2.json`);
      if (!response.ok) throw new Error('V2 road tiles unavailable');
      const adapter = await response.json() as { schemaVersion: number; replaces: number[]; tiles: Record<string, RoadFeature[]> };
      if (adapter.schemaVersion !== 2) throw new Error('Unsupported V2 road tiles');
      this.roadTiles = adapter.tiles;
      this.roadReplacements = new Set(adapter.replaces);
    }
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
      const empty = this.createEmptyChunk(cx, cz);
      this.chunkCache.set(key, empty);
      return empty;
    }

    const inflight = this.loadingChunks.get(key);
    if (inflight) {
      const res = await inflight;
      return res ?? this.createEmptyChunk(cx, cz);
    }

    const promise = (async () => {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}regions/${this.regionId}/chunks/${key}.json`);
        if (!res.ok) return null;
        const data = (await res.json()) as WorldChunkData;
        data.roads = [...data.roads.filter(road => !this.roadReplacements.has(road.id)), ...(this.roadTiles[key] ?? [])];
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
    return loaded ?? this.createEmptyChunk(cx, cz);
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

  private createEmptyChunk(cx: number, cz: number): WorldChunkData {
    return {
      key: `${cx}_${cz}`,
      cx,
      cz,
      buildings: [],
      roads: this.roadTiles[`${cx}_${cz}`] ?? [],
      walls: [],
      piers: [],
      woodlands: [],
    };
  }
}
