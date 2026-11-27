# Procedural facade layer — Ambleside & Waterhead

Based on the business-inventory branch (PR #52), not Unity Lakeland World. Existing source building footprints, heights, roof geometry, terrain, road routing, collision envelopes and custom GLB assets are unchanged. The facade layer is enabled in the existing Ambleside area bounds.

* Six metadata-driven families, road-facing outward edge (both winding directions supported), fallback to mapped anchor then longest usable edge.
* Door panels, projecting trim and sills, layered dark glazing, display windows, fascia backing, occasional clearance-checked awnings and repeated upper-floor windows on front and up to two other edges.
* Solid walls remain intact; recess is simulated by projecting frames around inset-looking glass, not boolean-cut openings or functional entrances. Single centered doorway per frontage; roof compatibility is achieved by keeping all details on existing wall height. Side windows, floor counts and shop unit subdivisions are procedural, not surveyed.
* Existing signage system draws the physical fascia name at the planned anchor with its original distance visibility and disposal. Inventory building matches require stable source ID and matching coordinates; navigation matches require explicit source ID and polygon containment. Ambiguous matches suppressed; unlocated directory records never become storefront identities by proximity. Existing source-named commercial buildings can retain their mapped names unless inventory identifies them as unresolved.
* At most 180 box pieces/building and five instanced batches/chunk (plus existing signage). No new texture dependencies. Existing collision stays authoritative; thin cosmetic projections do not create new obstacles. Awnings are shallow and visually provisional. Detailed frame geometry streams with existing chunks, no independent per-building LOD; mobile frame rate needs measurement.
* Not photo verified. Validate actual entrances, facade material, floor/window positions, adjoining shops and roof profiles with authorized photographs and survey data. Confirm both portrait and landscape on real iPad/iPhone before merge. Do not use copyrighted logos or extract Google imagery.

Tests: `npm run lint`, `node --import tsx --test src/{geo,game}/*.test.ts`, `npm run build -- --base=/LakelandRush/`. PR workflow runs these without publishing.
