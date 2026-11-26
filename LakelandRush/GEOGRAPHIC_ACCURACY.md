# Geographic accuracy

The locked archive has 177 chunks at 500 m, 4,822 unique buildings, 3,099 roads and paths, 626 walls, 522 woodland records and 155 pier records. 601 buildings have names, 4,112 use 6.4 m heights, and zero have height provenance. Terrain has 36 rows × 28 columns, about 312 × 585 m spacing, with no detail overlay. The renderer extruded footprints underneath pyramidal roofs, had generic windows and used a rectangular water plane. Empty chunks generated fictional farmsteads, walls and copses. Static inspection found existing streaming, camera, parkour, scoring and weather systems, plus unused GenAI dependency and example configuration. The AI Studio quota interruption and which session authored each file are historical claims that the archive alone cannot establish.

| Coverage | Classification and evidence |
| --- | --- |
| Waterhead terrain | Local nodes from the EA 1 m DTM at 4 m game spacing. Grid is 173 × 153 with 25,586 valid nodes. Missing nodes use the coarse layer with an 85 m outer blend. |
| Waterhead building heights | Paired DTM/DSM statistics for 48 buffered footprints, including 38 candidates flagged for review. None are automatically assigned as verified building heights. |
| Booking office, OSM way 423828335 | Verified mapped position and identifiable historic lakeside facade. Model geometry and current appearance remain approximate. |
| The Waterhead Inn, OSM way 423874287 | Exported as Waterhead Hotel. Lake Road address and FHRS 299044 match the present operator. The facade, bay, gables and veranda use a licensed 2014 photograph and the operator exterior as a cross-check. Secondary roof volumes and measurements remain approximate. |
| Waterhead piers | Closed mapped outlines fill up to a shared approximate deck elevation. Deck heights, furnishings and structure need field checks. |
| Waterhead Coffee Shop, OSM way 423874283 | Named mapped footprint. Appearance awaits visual verification. |
| Lakeside Picnic, OSM way 256765270 | OSM node 4233922881 at 54.4208591, −2.9623546 agrees with the trading site pin. The FSA point shares FHRS ID 769781 but falls farther east. The shop gable, glazed entrance, plaque and forecourt are modelled with approximate measurements. |
| Esplanade shops, OSM way 423828326 | Shell Shop and Ambleside Fish & Chips share the mapped footprint. The awning, frontage and terrace use a licensed 2013 photograph. |
| Public realm | OSM anchors pavement lines, car park boundaries, railings, benches, bins and trees. Kerb widths, ironwork and terrace proportions use approximations. |
| Bridge House, Market Cross, Rothay Park and bridge | Remaining corridor targets. |
| Regional geometry outside the survey | Original mapped records, coarse elevations and procedural appearance. Missing chunk assets are empty. |

The coordinate conversion qualifies the accuracy of the raster-to-game placement. Legacy OSM features retain their local projection, the coverage blend is approximate, and adopted water level and out-of-water terrain clamps are gameplay conventions. No bathymetry was obtained.

## World Core V2

The initial audit found 731 of 796 canonical OSM road ways in the legacy runtime inventory. Sixty-five had no match in this comparison, which uses a defined snapshot envelope and includes mapping and eligibility differences. A further 112 matched ways extended beyond their single owner tile, creating a streaming visibility risk. The p95 source-to-legacy centreline vertex offset was 0.100 m across 4,630 vertices. Median footprint overlap was 98.46% across 1,380 matched valid footprints, using OSM as the shared geometry source. Only 346 reached 99%. This is an adapter consistency comparison, not independent survey accuracy. The GDAL terrain and PyProj canonical origins agreed in the test. The inspector's browser affine approximation had a sampled maximum of 0.230 m against the full OSTN15 conversion.

The adapter emits 759 compatible road ways, including 39 new to gameplay, across 24 tiles. Automated checks cover consecutive OSM node connectivity on both main approaches, Old Lake Road and the shop link, plus road ribbon continuity at tile seams. Conditions outside these tests include exact pavement widths, junction surface construction, bridge crown profiles, vegetation or building obstructions, and complete player traversal. See [the machine-readable audit](references/world-core-v2-audit.json) and [the geographic acceptance standard](GEOGRAPHIC_ACCURACY_STANDARD.md).

Infill meshes use canonical OSM footprint vertices from the V2 adapter where a background building matches a mapped source ID. Authored landmarks preserve their previous asset registration. Generic doors are inferred from the nearby road network. The two pilot interaction thresholds are registered to their authored GLB doors and have not been independently surveyed.
