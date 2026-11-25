#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
blender -b -t 2 --python-exit-code 1 -P scripts/build-waterhead-frontages.py
if [[ -n "${GLTF_TRANSFORM:-}" ]]; then
  for name in waterhead-inn lakeside-picnic esplanade-shops; do
    base="public/regions/windermere/assets/$name"
    "$GLTF_TRANSFORM" meshopt "$base.glb" "$base.meshopt.glb" --quantize-texcoord 16
    mv "$base.meshopt.glb" "$base.glb"
  done
fi
