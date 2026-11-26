# Known limitations

- The Waterhead benchmark is an initial reconstruction. Resident recognition, current architectural appearance and field dimensions remain unverified.
- Landward facades and secondary roofs of the Inn, Picnic and Esplanade shop block need current reference views. Waterhead Coffee Shop and other businesses still use proxies.
- Deck height, shoreline carving, road widths, roof colliders and terrain blend remain approximations. The coarse background has inadequate samples for reliable hill silhouettes.
- Survey files report height candidates and distribution statistics. They can include vegetation or acquisition mismatches and need manual review before overriding roof dimensions.
- Free Roam now starts by the booking office. The exported auto-forward exploration controls, simplified collisions and marker handling still need the full exploration update.
- The waterfront models currently have a single level of detail. Download images are 512² WebP, decoded to ordinary GPU textures. Meshopt, KTX2, HDR landscapes, adaptive LOD and physical-device profiling remain pending.
- External font loading reported a certificate error in the baseline Chromium environment. Vite still warns about the legacy config's `__dirname` and the size of the main entry.

World Core V2 uses an OSM-derived working package and compatibility road adapter. Independently measured road and footprint accuracy, complete terrain and collision verification, player traversal and the professional art benchmark are still open. The correction tool exports proposed JSON for review. Holiday stamps and demo interactions are local simulations. Real social, payments, GPS and other platform services remain planned.
