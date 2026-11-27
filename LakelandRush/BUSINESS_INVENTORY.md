# Ambleside business inventory — initial integration

The 27 November 2026 seed inventory contains 241 business and public-place records, each with its original ID, category, available address and source URLs. It is not a verified or exhaustive trading register.

- 30 name or explicit alias matches to the existing OSM-derived buildings, POIs or navigation landmarks in 22 checked map chunks (snapshot commit 4c228bd191c57a3d8da188dd5a35d59f6374c9f7).
- 211 records are unlocated and must not be rendered as map pins or 3D labels until evidence is obtained. No postcode or street centroids were assigned.
- Map and nearby Free Roam labels use the existing game projection and existing source features. A building centroid is not a surveyed entrance, and matching a historic map name does not establish current trading.
- Existing custom assets, roads, terrain, collision geometry and safe fast-travel stops remain unchanged.

Next reconciliation: retrieve current named shops, amenities, tourism and office POIs from OpenStreetMap, and the FSA FHRS geocoded establishments for food businesses. Verify identity and address, retain source object ID, retrieval date, coordinates and licence, then inspect against building footprints. Keep OSM and FSA provenance distinct. Do not automatically snap to the nearest building or place a home-based business on a public storefront. Multiple tenants can share one footprint, but frontage/entrance locations require independent evidence. See https://api.ratings.food.gov.uk/Help/Index/ and https://www.openstreetmap.org/copyright.

To verify: from LakelandRush, run npm run lint, node --import tsx --test src/{geo,game}/*.test.ts, and npm run build -- --base=/LakelandRush/. Then check Places & roads and Free Roam on a physical mobile device.
