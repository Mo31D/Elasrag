"""Sample the extended Environment Agency 1 m DTM at a 4 m game grid."""
import argparse
import json
from pathlib import Path
import numpy as np
from osgeo import gdal

from importlib import import_module
survey = import_module("waterhead-lidar")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("ambleside", type=Path)
    parser.add_argument("waterhead", type=Path)
    parser.add_argument("--ostn15-dir", required=True, type=Path)
    args = parser.parse_args()
    sources = [args.waterhead, args.ambleside]
    for source in sources:
        data = gdal.Open(str(source))
        if data.GetGeoTransform()[1:3] != (1.0,0.0) or data.GetGeoTransform()[4:] != (0.0,-1.0):
            raise ValueError(f"{source}: expected a north-up 1 m raster")
        if data.GetSpatialRef().GetAuthorityCode(None) != "27700":
            raise ValueError(f"{source}: expected EPSG:27700")
    merged = gdal.BuildVRT("", [str(file) for file in sources], VRTNodata=-9999)
    values = merged.ReadAsArray().astype(float)
    values[(values == -9999) | ~np.isfinite(values)] = np.nan
    min_x, max_x, min_z, max_z = -592, 592, -2156, 44
    x,z = np.meshgrid(np.arange(min_x,max_x+1,4),np.arange(max_z,min_z-1,-4))
    transform = survey.british_grid_transform(args.ostn15_dir)
    heights = survey.sample((merged.GetGeoTransform(), values),
                            survey.grid_points(transform,x.ravel(),z.ravel())) - survey.DATUM
    original = json.loads((survey.REGION/"waterhead-survey.json").read_text())["detail"]
    cols = original["cols"]
    for i,h in enumerate(original["heights"]):
        if h is not None:
            r,c = divmod(i,cols)
            i_grid = round((max_z-original["maxZ"])/4)+r
            j_grid = round((original["minX"]-min_x)/4)+c
            heights[i_grid*x.shape[1]+j_grid] = h
    package = {
        "schemaVersion":1,"lakeDatumM":survey.DATUM,"verticalDatum":"ODN",
        "dataset":survey.DATASETS["dtm"],
        "inputFiles":[survey.file_info(file) for file in sources],
        "detail":{"rows":x.shape[0],"cols":x.shape[1],"minX":min_x,"maxX":max_x,
                  "minZ":min_z,"maxZ":max_z,"source":"Environment Agency composite DTM 1 m, OGL v3.0",
                  "heights":[round(float(h),2) if np.isfinite(h) else None for h in heights]}
    }
    print(f"{np.isfinite(heights).sum()} valid of {len(heights)} samples")
    (survey.REGION/"ambleside-terrain.json").write_text(json.dumps(package,separators=(",",":"))+"\n")


if __name__ == "__main__":
    main()
