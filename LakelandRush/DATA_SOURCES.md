# Data sources and reproducibility

| Data | Use |
| --- | --- |
| [EA 1 m DTM composite](https://environment.data.gov.uk/dataset/13787b9a-26a4-4775-8523-806d13af58fc) | 2022 composite, bare earth. The catalogue states British National Grid, OSTN15, Newlyn heights, and OGL. |
| [EA 1 m last-return DSM composite](https://environment.data.gov.uk/dataset/9ba4d5ac-d596-445a-9056-dae3ddec0178) | 2022 composite including buildings, vegetation and other surfaces. Used for percentile evidence inside footprints. |
| [OS OSTN15 grid distributed by PROJ](https://cdn.proj.org/uk_os_OSTN15_NTv2_OSGBtoETRS.tif) | Inverse grid shift from ETRS89 to OSGB36 before projection. Game WGS84 coordinates are treated as ETRS89 at mapping precision. |
| [OpenStreetMap](https://www.openstreetmap.org/copyright) | Exported buildings, routes, woodland, shore, islands and piers, under ODbL. |
| [OpenTopoData EU-DEM](https://www.opentopodata.org/datasets/eudem/) | Legacy regional background attributed to this source by the export. The exported file is a sparse resampling. |
| [DEFRA Survey Download](https://environment.data.gov.uk/DefraDataDownload/?Mode=survey) | Alternative route for published 5 km GeoTIFFs. The importer accepts local mosaics or multiple downloaded tiles. |

Download and regenerate from the project root with curl, GDAL, its Python bindings with NumPy, and Blender 4.3. The WCS script uses the product catalogues' advertised endpoints and local TIFF validation.

```sh
bash scripts/download-waterhead-lidar.sh
/usr/bin/python3 scripts/waterhead-lidar.py \
  --dtm .gis-cache/waterhead-dtm.tif \
  --dsm .gis-cache/waterhead-dsm.tif --vertical-datum ODN
blender -b -t 2 --python-exit-code 1 -P scripts/build-waterhead-pier.py
```

Each WCS raster was verified at 900 × 700 pixels, 1 m EPSG:27700, with defined NoData. Both use the catalogued Ordnance Datum Newlyn. Their horizontal GeoTIFF tags alone do not establish the vertical datum. The survey manifest records raster and OSTN15 checksums. The gameplay water plane is the legacy approximation of 39 m ODN. The terrain blend between Newlyn and coarse EU-DEM does not apply a geoid conversion to the legacy samples.

Regional vector/elevation refresh can stage into a new directory with `node --import tsx scripts/fetch-lakeland-gis.ts .gis-cache/region-refresh`. The legacy importer used hand-written TIFF parsing, unconfirmed WCS paths and centroid-only roof estimates. The current regional refresh leaves all LiDAR work to the separate GeoTIFF importer. End-to-end refreshing of the regional OpenTopoData and Overpass datasets remains untested in this milestone.

Wikimedia Commons and Geograph have historical coverage for the waterfront. The checked photographs and permissions are in [the reference inventory](references/waterhead.json). Mapillary and KartaView have no verified imagery in this project inventory. No Google Maps or Street View imagery was acquired.
