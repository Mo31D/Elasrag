# Geographic package schema V2

`public/world-core/ambleside-v2.json` contains the WGS84 snapshot envelope, horizontal and vertical datums, ODbL source metadata, British National Grid coordinates indexed by OSM node ID, way metadata, layer indexes and pilot entity records. Ordered node pairs define road edges. Their source keys are the OSM way ID and ordered source node IDs. Preserve separate access and direction evidence in OSM tags. Width, level, restrictions and source completeness require additional processing and verification before vehicle routing.

`road-tiles-v2.json` is a downstream rendering adapter. Its `replaces` list suppresses matching legacy ways. Tile records carry seam context. Ground heights still use the existing LiDAR-derived terrain package. Source records at the envelope can extend outside it. Administrative and multipolygon relation coverage remains incomplete.
