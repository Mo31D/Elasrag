# Lakeland Rush — Technical Architecture & Region Import Guide

## 1. System Architecture
Lakeland Rush separates GIS ingestion, geographic streaming, physics/scoring rules, 3D rendering, audio synthesis, and UI overlays into independent TypeScript modules:

- `scripts/fetch-lakeland-gis.ts` — Offline GIS ingestion pipeline that extracts OpenStreetMap (ODbL) vectors and EU-DEM 25m terrain elevations and compiles them into static `500m x 500m` spatial chunks under `public/regions/<regionId>/`.
- `src/geo/projection.ts` — Local metric tangent-plane projection (`+X` East, `-Z` North, `Y` relative to lake datum), bilinear coarse elevation, triangle interpolation in the Waterhead survey, water/island tests, and route polyline sampling.
- `src/geo/regionLoader.ts` — `RegionManager` streaming spatial chunks around the player with distance-based eviction and empty chunks when vector data is absent.
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

Run `node --import tsx scripts/fetch-lakeland-gis.ts .gis-cache/region-refresh` to stage a regional refresh from OpenTopoData and OpenStreetMap. See DATA_SOURCES.md for the separate offline Waterhead importer.

## 3. Attribution & Licensing
- Geographic vectors (buildings, roads, walls, piers, Lake Windermere shoreline): Map data © OpenStreetMap contributors (ODbL).
- Terrain elevation grid: Copernicus EU-DEM 25m via OpenTopoData.
- See ASSET_LICENCES.md for the Waterhead survey, original booking office and reusable textures.

## 4. Build & Test
- Unit tests: `node --import tsx --test src/geo/projection.test.ts src/game/rules.test.ts`
- Type check: `npm run lint`
- Production build: `npm run build`

## Waterhead reconstruction

The frozen regional background, OSM-vector chunks, and shoreline remain under `public/regions/windermere`. RegionManager loads the Waterhead survey separately and supplies the same 4 m triangle sampler to world construction and physics. The terrain builder stitches dense Waterhead rows into the coarser background. Windermere is triangulated from mapped rings with island holes. The regional vector refresh stages into a separate folder and the GDAL importer works offline from local GeoTIFFs.

Building asset overrides are keyed by OSM way ID in `src/data/building-assets.json`. The engine owns shared GLB geometry and materials across chunk clones. Chunks own their procedural batches. Closed pier records in the survey area provide a deck surface and use the same mapped polygon for grounding. The deck elevation and booking office collision envelope are approximations.
