# World signage — first pass
- Road names/references derive from existing OSM road records (© OpenStreetMap contributors, ODbL). Original UK-inspired plates use estimated anchors, not surveyed sign locations or official artwork. No invented directional arrows, boundary signs or crests. Road meshes and collisions are unchanged.
- Seven bus records from Traveline National Dataset (OGL via UK City Map), plus one Windermere rail location (Geopunk; identity cross-checked against https://www.nationalrail.co.uk/stations/windermere/). Individual sources and original coordinates in src/data/transit.ts. Positions use existing game projection; neither exact pole/shelter placement nor live routes/timetables are verified.
- Named public buildings and existing local landmarks receive optional nearby labels in Free Roam. Existing mapped business models are unchanged; no claim of authentic facade artwork. No private cottage labels by default.
- Bus markers on local map, station marker on regional map. No unsafe fast travel to raw stop coordinates.
- Chunk-owned geometry/textures/materials are disposed on eviction. Physical signs cull at 110m, at most three labels per chunk within 45m. Cross-chunk overlap, GPU performance, exact sign placement and physical-device readability still require visual testing.
- New pure tests cover road deduplication, off-road placement, water exclusion and transport data. GitHub Actions existing lint/test/build gate must pass before Pages asset generation. 
- Next: official NaPTAN bulk import, surveyed directional/welcome signs, verified public POIs and reference-led facades, complete transport infrastructure. No watermarked photos used.

## V2 — directory and frontage pass
- New Places & roads map reads the existing chunk snapshot on demand for Ambleside/Waterhead, Windermere and Bowness. Search/category filters, mapped road and rail geometry, building identity and safe pre-existing travel stops only. No claim of current business trading status, complete coverage or surveyed appearance. No additional runtime third-party API.
- Seven additional published bus-stop coordinates from GeoPunk; sources in transit.ts. Full NaPTAN import remains outstanding because the download was not reachable from the editing environment. Local map filters to its own bounds.
- Footprint-edge plaques for named commercial buildings; custom GLBs unchanged. Original text and approximate location, not authenticated brand art or a reconstructed facade.
- Illustrative welcome boards on qualifying road anchors and conditional northbound Waterhead fork direction board; not surveyed sign positions. Reference https://www.gov.uk/government/publications/know-your-traffic-signs/direction-signs-on-all-purpose-roads . No Alamy imagery copied.
- Additional pure unit tests for directory filtering, duplicate building IDs, frontage orientation and water exclusion. Actual sign placements, physical-device performance, complete transport and facade photo survey remain outstanding.

## V3 — exploration controls and display
- Free Roam now uses an independent two-axis analog joystick / camera-relative WASD and drag-look, with diagonal normalization, pointer capture, cancellation, and an input dead zone. Body turns toward movement while camera remains independent. Indoor movement uses the same axes.
- Separate compact exploration HUD: place/map, menu, pause, walk/run, jump and contextual shop action. No racing score, combo, hearts or collectible obstacles in Free Roam. Races retain their original HUD and controls.
- Lower exploration jump, no heart penalty for water, basic footprint collision sliding, camera clearance and wider exploration FOV. Clear-weather ambient light and smoother tree geometry improve the appearance but remain procedural approximations.
- Added pure input and collision tests. Actual mobile multitouch, visual quality, GPU frame time and real-world facade/signage surveys still require physical testing. No new geographic claim or paid asset.

## V4
Explicit race exit to free exploration at current position; south approach spawn; graph connectivity test. Static cars inside mapped parking polygons with collision footprints. BP canopy text fascia based on confirmed business identity, not a survey. Initial retail reconciliation register; Greggs address confirmed but exact footprint remains unresolved. No road centerlines altered; actual traversal still needs device testing.
