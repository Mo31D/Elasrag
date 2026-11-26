# World Core V2

Canonical public data uses EPSG:27700 easting/northing pairs in metres. Raw snapshot hashes, retrieval times, source IDs and licences travel with the package. The explicit OSTN15 transform runs offline. WGS84 coordinates are treated as ETRS89 at mapping precision. Terrain elevation is ODN. The current game renders relative to 39 m ODN and retains its legacy east/south axes through a measured local adapter.

The V2 road tiles derive vertices from canonical OSM node geometry and intersect the 500 m gameplay tile boundaries. Both sides receive adjacent vertices for consistent ribbon orientation. Bridge ways retain a whole record because their approximated deck height uses both endpoints. Keep canonical geography independent of meshes, gameplay routes, businesses and eventually other clients. The inspector exposes the source map, road and terrain meshes, current coordinates, provenance, ruler and downloadable versioned correction proposals. Proposed changes require review and belong in a separately versioned override layer. This build exports proposals and does not apply them.

Remain on Three.js/WebGL 2 for this cycle because it supports a separate playable preview using existing assets and input. No side-by-side engine benchmark has been run. A future WebGPU or native client can consume the same package. Evaluate PostGIS only when indexed editing or concurrent geographic queries require it. Keep public data caches away from private account, location, order, employment and moderation stores.

## Reproduction

Download the exact OSM snapshot identified in the package. With Python, PyProj, NumPy, GDAL and the OSTN15 grid, run:

```sh
/usr/bin/python3 scripts/build-world-core.py snapshot.json --ostn15 /path/to/uk_os_OSTN15_NTv2_OSGBtoETRS.tif --retrieved 2026-11-25
python scripts/tile-world-core-roads.py
/usr/bin/python3 scripts/audit-world-core.py --ostn15-dir /path/to/grid-directory
bun install --frozen-lockfile
npm run lint
node --import tsx --test src/{geo,game}/*.test.ts
npm run build
```

Serve `dist/` on an isolated origin. Open `?inspect` for geographic QA and `?holiday` for local demonstration features. The preview has no server-side credentials or live platform services.
