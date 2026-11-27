export type GameState = 'title' | 'playing' | 'paused' | 'gameover';

export type WeatherPreset = 'clear' | 'cloudy' | 'rain' | 'mist' | 'sunset' | 'night';

export type GraphicsPreset = 'auto' | 'low' | 'medium' | 'high' | 'ultra';

export type TouchControlMode = 'buttons' | 'joystick';

export type PhotoPreset = 'runner' | 'vista' | 'lakeside';

export type CameraViewMode = 'third_person' | 'first_person';

export type VerificationStatus =
  | 'verified_geo_visual'
  | 'verified_geo_approx'
  | 'procedural_est'
  | 'no_reference';

export interface SettlementPoint {
  id: string;
  name: string;
  lat: number;
  lon: number;
  x: number;
  z: number;
  kind: 'town' | 'village' | 'pier' | 'landmark' | 'island' | 'ferry' | 'fell';
}

export interface TerrainGridData {
  rows: number;
  cols: number;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  lakeDatumM: number;
  heights: number[];
  /** Optional high-resolution UK Environment Agency LiDAR DTM overlay (e.g., Waterhead-Ambleside) */
  detail?: {
    rows: number;
    cols: number;
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
    heights: Array<number | null>;
    source: string;
  };
}

export interface LakeData {
  outerRings: Array<Array<[number, number]>>;
  innerRings: Array<Array<[number, number]>>;
  waterways: Array<{
    id: number;
    name?: string;
    kind: string;
    pts: Array<[number, number]>;
  }>;
}

export interface BuildingFeature {
  id: number;
  zone?: string;
  name?: string;
  kind: 'cottage' | 'hotel' | 'shop' | 'historic' | 'boathouse' | 'stone_terrace' | string;
  cx: number;
  cz: number;
  h: number;
  levels?: number;
  heightSource?: 'ea_lidar_dsm' | 'osm_tag' | 'estimated';
  material?: 'slate_stone' | 'whitewash' | 'sandstone' | 'timber' | string;
  wallColour?: string;
  roofShape?: 'gabled' | 'hipped' | 'pyramidal' | 'flat' | string;
  roofColour?: string;
  shopType?: string;
  amenity?: string;
  tourism?: string;
  historic?: string;
  streetName?: string;
  verification?: VerificationStatus;
  pts: Array<[number, number]>;
}

export interface PoiFeature {
  id: number;
  name: string;
  category:
    | 'shop'
    | 'cafe'
    | 'pub'
    | 'restaurant'
    | 'hotel'
    | 'attraction'
    | 'historic'
    | 'bank'
    | 'outdoor'
    | 'bakery'
    | 'other';
  x: number;
  z: number;
  buildingId?: number;
  outdoorSeating?: boolean;
  street?: string;
  verification: VerificationStatus;
}

export interface StreetPropFeature {
  id: number;
  kind: 'street_lamp' | 'crossing' | 'bus_stop' | 'bench' | 'post_box' | 'tree';
  x: number;
  z: number;
  name?: string;
}

export interface ParkFeature {
  id: number;
  name?: string;
  kind: 'park' | 'meadow' | 'retail' | 'car_park' | 'garden';
  cx: number;
  cz: number;
  pts: Array<[number, number]>;
}

export interface RoadFeature {
  id: number;
  zone?: string;
  name?: string;
  ref?: string;
  kind: 'primary' | 'secondary' | 'lane' | 'footpath' | 'ferry' | 'railway';
  bridge?: boolean;
  oneway?: boolean;
  direction?: 1 | -1;
  access?: string;
  sidewalk?: boolean;
  lit?: boolean;
  surface?: string;
  widthM?: number;
  pts: Array<[number, number]>;
}

export interface WallFeature {
  id: number;
  pts: Array<[number, number]>;
}

export interface PierFeature {
  id: number;
  name?: string;
  pts: Array<[number, number]>;
}

export interface WoodlandFeature {
  id: number;
  cx: number;
  cz: number;
  pts: Array<[number, number]>;
}

export interface WorldChunkData {
  key: string;
  cx: number;
  cz: number;
  buildings: BuildingFeature[];
  roads: RoadFeature[];
  walls: WallFeature[];
  piers: PierFeature[];
  woodlands: WoodlandFeature[];
  pois?: PoiFeature[];
  streetProps?: StreetPropFeature[];
  parks?: ParkFeature[];
}

export interface VerificationEntry {
  id: string;
  name: string;
  zone: string;
  kind: string;
  x: number;
  z: number;
  status: VerificationStatus;
  sources: string[];
  notes: string;
}

export interface RegionManifest {
  id: string;
  name: string;
  origin: {
    lat: number;
    lon: number;
    lakeDatumM: number;
  };
  chunkSize: number;
  availableChunks: string[];
  settlements: SettlementPoint[];
  attribution: string[];
  verificationSummary?: {
    verifiedGeoVisual: number;
    verifiedGeoApprox: number;
    proceduralEst: number;
    priorityCorridor: string;
    entries: VerificationEntry[];
  };
}

export interface RouteDefinition {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'Accessible' | 'Challenging' | 'Expert' | 'Open';
  mode: 'sprint' | 'freeroam';
  startName: string;
  finishName: string;
  lengthMeters: number;
  targetTimeSec: number;
  parScore: number;
  waypoints: Array<[number, number]>;
  corridorHalfWidth: number;
  landmarks: Array<{ name: string; x: number; z: number }>;
}

export interface GameSettings {
  weather: WeatherPreset;
  graphics: GraphicsPreset;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  ambienceVolume: number;
  muted: boolean;
  sensitivity: number;
  touchMode: TouchControlMode;
  autoPilot: boolean;
}

export interface HudSnapshot {
  score: number;
  combo: number;
  comboTimer: number; // 0..1 remaining
  speedKmh: number;
  hearts: number;
  maxHearts: number;
  progress: number; // 0..1
  distanceMeters: number;
  elapsedSec: number;
  tokensCollected: number;
  totalTokens: number;
  actionCallout: string;
  nearSettlement: string;
  nearLandmark?: string;
  lat?: number;
  lon?: number;
  playerX: number;
  playerZ: number;
  playerHeading: number;
  fps: number;
  isGrinding: boolean;
  isSliding: boolean;
  isAirborne: boolean;
  cameraViewMode?: CameraViewMode;
  exploreWalkPace?: boolean;
  explorePace?: 'walk'|'run'|'sprint';
  cleanExploreMode?: boolean;
  insideShop?: boolean;
  flying?: boolean;
  waterMode?:'land'|'swimming'|'rowing';
  canBoardBoat?:boolean;
  fastSwim?:boolean;
  accelerating?:boolean;
  busMode?:'passenger'|'driver';
  canBoardBus?:boolean;
  canDriveBus?:boolean;
  boatKind?:'rowboat'|'motorboat';
  canEnterShop?: boolean;
}

export interface RunResult {
  routeId: string;
  routeTitle: string;
  victory: boolean;
  score: number;
  bestScore: number;
  isNewBest: boolean;
  topSpeedKmh: number;
  maxCombo: number;
  elapsedSec: number;
  distanceMeters: number;
  tokensCollected: number;
  totalTokens: number;
  medal: 'Gold' | 'Silver' | 'Bronze' | 'Finish' | 'None';
  reason: string;
}

export interface RouteRecord {
  bestScore: number;
  bestTimeSec: number | null;
  topSpeedKmh: number;
  medal: 'Gold' | 'Silver' | 'Bronze' | 'Finish' | 'None';
}

export interface SaveData {
  records: Record<string, RouteRecord>;
  discoveredSettlements: string[];
  totalRuns: number;
  totalDistanceM: number;
}
