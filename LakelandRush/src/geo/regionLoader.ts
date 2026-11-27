import type {
  LakeData,
  RegionManifest,
  TerrainGridData,
  WorldChunkData,
} from '../types/game';
import { isPointInLake, sampleTerrainHeight } from './projection';
import { animalRoadExclusion,grazingExclusion } from './grassPlan';

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
  private animalMasks = new WeakMap<WorldChunkData,{road:(x:number,z:number)=>boolean;grazing:(x:number,z:number)=>boolean}>();

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

  private habitatBlocked(x:number,z:number,grazing:boolean):boolean {
    const [cx,cz,key]=this.getChunkKeyForWorld(x,z);
    // Never infer safe ground in a tile that has not been loaded.
    if(!this.chunkCache.has(key)||!this.availableChunkSet.has(key))return true;
    const size=this.getChunkSize(),margin=12;
    const xs=[cx],zs=[cz];
    if(x-cx*size<margin)xs.push(cx-1);
    if((cx+1)*size-x<margin)xs.push(cx+1);
    if(z-cz*size<margin)zs.push(cz-1);
    if((cz+1)*size-z<margin)zs.push(cz+1);
    for(const a of xs)for(const b of zs){
      const k=a+'_'+b,chunk=this.chunkCache.get(k);
      if(!chunk){if(this.availableChunkSet.has(k))return true;continue;}
      let masks=this.animalMasks.get(chunk);
      if(!masks){masks={road:animalRoadExclusion(chunk),grazing:grazingExclusion(chunk,(px,pz)=>this.isInWater(px,pz))};this.animalMasks.set(chunk,masks);}
      if((grazing?masks.grazing:masks.road)(x,z))return true;
    }
    return false;
  }
  public isAnimalRoadFree(x:number,z:number):boolean {
    return !this.habitatBlocked(x,z,false);
  }
  public isGrazingGround(x:number,z:number,clearance=0):boolean {
    if(this.habitatBlocked(x,z,true)||this.isInWater(x,z))return false;
    const y=this.getTerrainHeight(x,z);
    if(!Number.isFinite(y)||y<.5)return false;
    for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
      if(Math.abs(this.getTerrainHeight(x+dx,z+dz)-y)>.65)return false;
    }
    if(clearance>0)for(let i=0;i<8;i++){
      const a=i*Math.PI/4,px=x+Math.cos(a)*clearance,pz=z+Math.sin(a)*clearance;
      if(this.habitatBlocked(px,pz,true)||this.isInWater(px,pz)||Math.abs(this.getTerrainHeight(px,pz)-y)>clearance*.65)return false;
    }
    return true;
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
      roads: [],
      walls: [],
      piers: [],
      woodlands: [],
    };
  }
}
