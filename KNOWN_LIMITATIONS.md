# Known limitations

- The Waterhead benchmark is an initial reconstruction. Resident recognition, current architectural appearance and field dimensions remain unverified.
- The Waterhead Inn and adjoining shops need individual models. The Hotel's footprint now renders but the roof cap is a proxy. There are no authored models of Bridge House or Market Cross.
- Deck height, shoreline carving, road widths, roof colliders and terrain blend remain approximations. The coarse background has inadequate samples for reliable hill silhouettes.
- Survey files report height candidates and distribution statistics. They can include vegetation or acquisition mismatches and need manual review before overriding roof dimensions.
- Free Roam now starts by the booking office. The exported auto-forward exploration controls, simplified collisions and marker handling still need the full exploration update.
- The GLB is a single 16 KB level of detail. Download images are 512² WebP, decoded to ordinary GPU textures. Meshopt, KTX2, HDR landscapes, adaptive LOD and physical-device profiling remain pending.
- External font loading reported a certificate error in the baseline Chromium environment. Vite still warns about the legacy config's `__dirname` and the size of the main entry.
