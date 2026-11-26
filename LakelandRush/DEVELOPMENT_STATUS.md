# Development status

The local `LakelandRush` repository contains the `original-export` Git tag and the `waterhead-reconstruction` development branch. The original app source, lockfile and geographic data are in the tag. AI Studio's transient media and logs were excluded from Git and remain in the extracted archive directory.

## Delivered

- Verified the archive's counts and original build/test status. No framework upgrades were needed. Captured the original sprint and a matched Waterhead camera.
- Downloaded two official 900 × 700 Environment Agency GeoTIFF clips and checked their georeferencing and NoData metadata. Converted Waterhead to a 4 m authored grid using GDAL, NumPy and OSTN15. Recorded paired-surface statistics for 48 footprints.
- Added an original GLB of the Ambleside Pier booking office, mapped deck geometry, water polygons with island holes and animated normals, slate colour/normal/roughness textures, a repaired Waterhead Inn footprint, and a nearby Free Roam start.
- Kept regional features and routes. Removed invented physical features from missing data chunks.

## Verification

The TypeScript check, nine unit tests, production build and Chromium gameplay smoke tests passed. The survey package reproduced byte-for-byte using the downloaded rasters. Desktop and mobile emulation screenshots and renderer counts are in [the performance report](PERFORMANCE_REPORT.md) and [visual benchmarks](VISUAL_BENCHMARKS.md). Physical-device performance and resident recognition remain open.

## Google development tools

Google documents `agy` for Antigravity CLI with OAuth for individual plans. The individual plan publishes baseline weekly limits and eligible model access. The Developer API requires a compatible Cloud project and API key. Google lists `gemini-3.5-flash-lite` standard image input and output as free on its free tier, and Gemini 4 Argon as unavailable on that tier. Rate limits are model- and project-specific in AI Studio. Account-level access and remaining quota could not be verified from the authorised environment. No AI calls, API credentials or billing changes were used. The game is independent of Google AI.

- [Antigravity CLI quickstart](https://antigravity.google/docs/getting-started?tab=cli)
- [Antigravity plans](https://antigravity.google/docs/plans)
- [Gemini API key setup](https://ai.google.dev/gemini-api/docs/api-key)
- [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Gemini rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)

## Next priority

Complete Stage C by reconstructing the Waterhead Inn's main roadside facade and roof sections, then survey the terraces, railings and approaches between Lake Road and the pier. Compare against current public or owner-supplied photographs and collect an unlabelled review from a local before extending the corridor. See [capture requirements](WATERHEAD_CAPTURE.md) and [current accuracy](GEOGRAPHIC_ACCURACY.md).

## Waterfront production pass

The Waterhead Inn, Lakeside Picnic and adjoining Esplanade shops have reproducible original Blender models. A local public-realm layer uses mapped parking areas, sidewalks, fences and furniture. It adds hand-authored terrace details, weathered decking, near-shore tint, skiffs and a low-cost cloud and lighting pass. Regional arcade and exploration logic remain in place. See [photographic provenance](references/waterhead.json) and [visual benchmarks](VISUAL_BENCHMARKS.md).

For the current asset pipeline, run `GLTF_TRANSFORM=/path/to/gltf-transform bash scripts/build-waterhead-assets.sh` using Blender 4.3 and glTF Transform 4.4.0. The optional CLI applies Meshopt compression. The separate booking office generator remains available. The reusable mesh module cuts facade openings and builds jambs, glazing, joinery, gables and three-dimensional signs.

The production build passed TypeScript checks, the existing unit tests, and desktop and iPad-emulated playthroughs. The private production preview was published at https://lakeland-rush-waterhead.elasrag.chatgpt.site/ and shows a ChatGPT sign-in gate. The local production build was exercised with browser request fixtures. Field dimensions, a current Coffee Shop frontage and a resident recognition review remain open.

## Ambleside and Waterhead corridor

The priority road graph was re-imported from current OSM with both road approaches and Old Lake Road. The arcade centreline follows the imported alignment to Bridge House. An Environment Agency composite DTM extends street-level elevation coverage into Ambleside. Free Roam includes a tappable route and landmark map, fast travel, walking and sprinting, camera look and view options, and an isolated provisional Black Sheep Shop interior. Original exterior GLBs cover Lancaster House, Bridge House and Market Cross. See [accuracy, regeneration and missing references](ROAD_NETWORK_AMBLESIDE.md).

Next, use owner photographs to validate the Black Sheep frontage and interior, then reconstruct and verify recognisable practical sites with current references. Collect labelled and unlabelled physical-device reviews at the same viewpoints.

## Lakeland World V2 foundation cycle

V1 remains available at the existing public URL and is tagged `lakeland-rush-v1-stable`. V2 work is isolated on `lakeland-world-v2`. The first package normalises OSM geometry into British National Grid, introduces road tile seams and a geographic inspector, and records two pilot premises separately from the businesses. The existing playable Three.js world and arcade challenges provide a V2 test harness. A local virtual passport and fictional social interaction demo are available from My Holiday. No physical location, account, real social profile, checkout or financial reward is processed.

Next acceptance work uses an independent road and footprint source, full player traversal, terrain and collision sampling tests, and founder-reviewed screenshots before new production art. See [master roadmap](MASTER_ROADMAP.md).

### Doors and exploration controls

V2 now projects mapped background footprints directly from its canonical package. Background architecture has footprint-conforming pitched roofs, recessed windows and inferred street-facing doors using shared batched materials. Individually reconstructed buildings retain their authored positions. The shop door geometry is authored for both pilot businesses, and fast travel arrives at the exterior thresholds. Black Sheep and Lakeside Picnic have separate enterable interiors, both provisional layouts. For the latter, café seating and the counter are illustrative pending owner references.

Free Roam uses camera-relative WASD, or a two-axis joystick with independent drag-to-look on touch screens. Hold Shift to sprint, press E or use the contextual control at a shop, and use Space or Jump outdoors. Movement accelerates and settles smoothly. Axis-separated collision helps movement slide along walls and the exterior chase camera pulls in near buildings. Arcade controls remain separate.
