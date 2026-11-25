# Lakeland Rush — Technical Architecture & Region Import Guide

## 1. System Architecture
Lakeland Rush separates GIS ingestion, geographic streaming, physics/scoring rules, 3D rendering, audio synthesis, and UI overlays into independent TypeScript modules:

- `scripts/fetch-lakeland-gis.ts` — Offline GIS ingestion pipeline that extracts OpenStreetMap (ODbL) vectors and EU-DEM 25m terrain elevations and compiles them into static `500m x 500m` spatial chunks under `public/regions/<regionId>/`.
- `src/geo/projection.ts` — Local metric tangent-plane projection (`+X` East, `-Z` North, `Y` relative to lake datum), bilinear elevation interpolation, point-in-polygon water/island checks, and route spline sampling.
- `src/geo/regionLoader.ts` — `RegionManager` streaming spatial chunks around the player with automatic LRU eviction and deterministic rural fallback generation.
- `src/game/rules.ts` — Pure scoring, flow combo multipliers, collision penalties, medal thresholds, and `localStorage` persistence.
- `src/engine/textures.ts` & `src/engine/models.ts` — Procedural PBR `CanvasTexture` surfaces and composite multi-part `THREE.Group` models (character, Stagecoach bus, 4x4 Defender, Windermere steamer, Herdwick sheep, cairn tokens).
- `src/engine/worldBuilder.ts` — Extrudes real OSM building footprints with pitched Westmorland slate roofs, roads, dry-stone walls, piers, instanced woodland trees, vertex-colored terrain, and animated `onBeforeCompile` lake water.
- `src/engine/LakelandEngine.ts` — Main Three.js loop with `RoomEnvironment` IBL, software-WebGL detection (`afterDraw` pacing), sky-drop intro, parkour physics (vaulting, sliding, rail grinding), British left-hand traffic, pooled particles, and Photo Mode.
- `src/audio/soundEngine.ts` — 100% procedural Web Audio API sound effects, surface footsteps, wind/rain ambience, and adaptive music.

## 2. Region Package Standard (`public/regions/<regionId>/`)
To add a new Lake District region (e.g. `grasmere`, `keswick`, `ullswater`, `coniston`):
1. `manifest.json`: `{ id, name, origin: { lat, lon, lakeDatumM }, chunkSize, availableChunks, settlements, attribution }`
2. `terrain.json`: `{ rows, cols, minX, maxX, minZ, maxZ, lakeDatumM, heights }`
3. `lake.json`: `{ outerRings, innerRings, waterways }`
4. `chunks/<cx>_<cz>.json`: `{ key, cx, cz, buildings, roads, walls, piers, woodlands }`

Run `npx tsx scripts/fetch-lakeland-gis.ts` (editing `REGION_BOUNDS` and `TILE_ZONES` for the new region) to generate a complete offline package with zero runtime external API dependencies.

## 3. Attribution & Licensing
- Source code: Apache-2.0
- Geographic vectors (buildings, roads, walls, piers, Lake Windermere shoreline): Map data © OpenStreetMap contributors (ODbL).
- Terrain elevation grid: Copernicus EU-DEM 25m via OpenTopoData.
- Rural areas between surveyed village tiles use deterministic procedural generation for stone boundary walls and woodland copses.

## 4. Build & Test
- Unit tests: `npx --yes tsx --test src/geo/projection.test.ts src/game/rules.test.ts`
- Type check: `npm run lint`
- Production build: `npm run build`
