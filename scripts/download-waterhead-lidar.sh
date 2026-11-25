#!/usr/bin/env bash
set -euo pipefail
destination=${1:-.gis-cache}
mkdir -p "$destination"

download() {
  local kind="$1" product="$2" coverage="$3"
  local temp
  temp=$(mktemp "$destination/.waterhead-$kind.XXXXXX")
  if curl --get --fail --silent --show-error --retry 3 --max-time 120 \
    "https://environment.data.gov.uk/spatialdata/$product/wcs" \
    --data-urlencode service=WCS --data-urlencode version=2.0.1 \
    --data-urlencode request=GetCoverage --data-urlencode "coverageId=$coverage" \
    --data-urlencode 'subset=E(337200,338100)' \
    --data-urlencode 'subset=N(502850,503550)' \
    --data-urlencode format=image/tiff -o "$temp" && gdalinfo "$temp" >/dev/null; then
    mv "$temp" "$destination/waterhead-$kind.tif"
  else
    rm -f "$temp"
    return 1
  fi
}

download dtm lidar-composite-digital-terrain-model-dtm-1m \
  13787b9a-26a4-4775-8523-806d13af58fc__Lidar_Composite_Elevation_DTM_1m
download dsm lidar-composite-digital-surface-model-last-return-dsm-1m \
  9ba4d5ac-d596-445a-9056-dae3ddec0178__Lidar_Composite_Elevation_LZ_DSM_1m

curl --fail --silent --show-error --location --retry 3 --max-time 60   https://cdn.proj.org/uk_os_OSTN15_NTv2_OSGBtoETRS.tif   -o "$destination/uk_os_OSTN15_NTv2_OSGBtoETRS.tif"
