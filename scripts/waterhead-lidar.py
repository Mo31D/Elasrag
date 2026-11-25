#!/usr/bin/env python3
"""Build the Waterhead package with system GDAL 3 and NumPy."""
import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
from osgeo import gdal, ogr, osr

gdal.UseExceptions()
osr.UseExceptions()
DATASETS = {
    "dtm": "13787b9a-26a4-4775-8523-806d13af58fc",
    "dsm": "9ba4d5ac-d596-445a-9056-dae3ddec0178",
}
OSTN15 = "uk_os_OSTN15_NTv2_OSGBtoETRS.tif"
REGION = Path(__file__).resolve().parents[1] / "public/regions/windermere"
ORIGIN_LAT, ORIGIN_LON, DATUM = 54.4175, -2.9635, 39
M_LAT = 111319.5
M_LON = M_LAT * np.cos(np.radians(ORIGIN_LAT))


def crs(code):
    ref = osr.SpatialReference()
    ref.ImportFromEPSG(code)
    ref.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    return ref


def british_grid_transform(grid_dir):
    # Treat the game/OSM WGS84 coordinates as ETRS89 at mapping precision.
    # The explicit inverse NTv2 operation prevents a silent Helmert fallback.
    if not (grid_dir / OSTN15).is_file():
        raise FileNotFoundError(grid_dir / OSTN15)
    osr.SetPROJSearchPaths([str(grid_dir.resolve()), *osr.GetPROJSearchPaths()])
    options = osr.CoordinateTransformationOptions()
    options.SetOperation(
        "+proj=pipeline +step +proj=axisswap +order=2,1 "
        "+step +proj=unitconvert +xy_in=deg +xy_out=rad "
        f"+step +inv +proj=hgridshift +grids={OSTN15} "
        "+step +proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 "
        "+x_0=400000 +y_0=-100000 +ellps=airy"
    )
    return osr.CreateCoordinateTransformation(crs(4326), crs(27700), options)


def file_info(path):
    with path.open("rb") as file:
        return {"file": path.name, "sha256": hashlib.file_digest(file, "sha256").hexdigest()}


def grid_points(transform, x, z):
    return np.asarray(transform.TransformPoints(
        np.column_stack((ORIGIN_LON + x / M_LON, ORIGIN_LAT - z / M_LAT))
    ))[:, :2]


def read_mosaic(paths):
    for path in paths:
        ds = gdal.Open(str(path))
        _, dx, rx, _, rz, dy = ds.GetGeoTransform()
        if (not ds.GetSpatialRef().IsSame(crs(27700), ["IGNORE_DATA_AXIS_TO_SRS_AXIS_MAPPING=YES"])
                or ds.RasterCount != 1 or (dx, rx, rz, dy) != (1, 0, 0, -1)
                or ds.GetRasterBand(1).GetNoDataValue() is None):
            raise ValueError(f"{path} must be a north-up 1 m EPSG:27700 raster with NoData")
    mosaic = gdal.BuildVRT("", [str(path) for path in paths], VRTNodata=-9999)
    # Read only the benchmark with a small interpolation guard, including if given full tiles.
    clipped = gdal.Translate("", mosaic, format="MEM",
                             projWin=[337198, 503552, 338102, 502848])
    array = clipped.ReadAsArray().astype(float)
    array[(array == -9999) | ~np.isfinite(array)] = np.nan
    return clipped.GetGeoTransform(), array


def sample(raster, east_north):
    (e, _, _, n, _, _), values = raster
    x = east_north[:, 0] - e - 0.5
    y = n - east_north[:, 1] - 0.5
    i, j = np.floor(x).astype(int), np.floor(y).astype(int)
    valid = (i >= 0) & (j >= 0) & (i + 1 < values.shape[1]) & (j + 1 < values.shape[0])
    i, j, x, y = i[valid], j[valid], x[valid], y[valid]
    u, v = x - i, y - j
    result = np.full(len(valid), np.nan)
    result[valid] = ((1-u)*(1-v)*values[j, i] + u*(1-v)*values[j, i+1]
                     + (1-u)*v*values[j+1, i] + u*v*values[j+1, i+1])
    return result


def building_surveys(transform, dtm, dsm, bounds):
    min_x, min_z, max_x, max_z = bounds
    for path in sorted((REGION / "chunks").glob("*.json")):
        for b in json.loads(path.read_text())["buildings"]:
            x, z = b["cx"], b["cz"]
            if not (min_x < x < max_x and min_z < z < max_z) or len(b["pts"]) < 3:
                continue
            points = np.asarray(b["pts"]) + (x, z)
            ring = ogr.Geometry(ogr.wkbLinearRing)
            for e, n in grid_points(transform, points[:, 0], points[:, 1]):
                ring.AddPoint_2D(e, n)
            ring.CloseRings()
            polygon = ogr.Geometry(ogr.wkbPolygon)
            polygon.AddGeometry(ring)
            if not polygon.IsValid():
                continue
            core = polygon.Buffer(-1)
            if core.IsEmpty():
                continue
            e0, e1, n0, n1 = core.GetEnvelope()
            samples = []
            point = ogr.Geometry(ogr.wkbPoint)
            for e in np.arange(np.floor(e0) + 0.5, e1, 1):
                for n in np.arange(np.floor(n0) + 0.5, n1, 1):
                    point.SetPoint_2D(0, e, n)
                    if core.Contains(point):
                        samples.append((e, n))
            if len(samples) < 8:
                continue
            ground, surface = sample(dtm, np.asarray(samples)), sample(dsm, np.asarray(samples))
            mask = np.isfinite(ground) & np.isfinite(surface)
            if mask.sum() < max(8, 0.75 * len(samples)):
                continue
            p10, p50, p90 = np.percentile((surface-ground)[mask], (10, 50, 90))
            # Wide spreads can be trees, mixed footprints, roof slopes or changed buildings.
            candidate = bool(2.5 <= p50 <= 22 and p10 >= 1.5 and p90 - p10 <= 6)
            yield str(b["id"]), {
                "samples": int(mask.sum()), "footprintSamples": len(samples),
                "groundOdnM": round(float(np.median(ground[mask])), 2),
                "surfaceOdnP90M": round(float(np.percentile(surface[mask], 90)), 2),
                "relativeHeightP10M": round(float(p10), 2),
                "relativeHeightP50M": round(float(p50), 2),
                "relativeHeightP90M": round(float(p90), 2),
                "candidateForReview": candidate,
            }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dtm", nargs="+", type=Path, required=True)
    parser.add_argument("--dsm", nargs="+", type=Path, required=True)
    parser.add_argument("--vertical-datum", required=True, choices=["ODN"],
                        help="Confirm both inputs are sourced from EA metadata specifying Newlyn")
    parser.add_argument("--ostn15-dir", type=Path, default=Path(".gis-cache"))
    parser.add_argument("--output", type=Path, default=REGION / "waterhead-survey.json")
    args = parser.parse_args()
    transform = british_grid_transform(args.ostn15_dir)
    dtm, dsm = read_mosaic(args.dtm), read_mosaic(args.dsm)
    min_x, min_z, max_x, max_z = -220, -564, 468, 44
    spacing = 4
    x, z = np.meshgrid(np.arange(min_x, max_x + 1, spacing),
                       np.arange(max_z, min_z - 1, -spacing))
    heights = sample(dtm, grid_points(transform, x.ravel(), z.ravel())) - DATUM
    if not np.isfinite(heights).any():
        raise ValueError("DTM has no valid coverage over Waterhead")
    hashes = {kind: [file_info(path) for path in getattr(args, kind)] for kind in DATASETS}
    report = dict(building_surveys(transform, dtm, dsm, (min_x, min_z, max_x, max_z)))
    package = {
        "schemaVersion": 1, "datasets": DATASETS, "inputFiles": hashes,
        "horizontalCrs": "EPSG:27700", "horizontalTransform": "OSTN15",
        "horizontalGrid": file_info(args.ostn15_dir / OSTN15), "verticalDatum": args.vertical_datum,
        "lakeDatumM": DATUM,
        "detail": {
            "rows": z.shape[0], "cols": x.shape[1],
            "minX": min_x, "minZ": min_z, "maxX": max_x, "maxZ": max_z,
            "heights": [round(float(h), 2) if np.isfinite(h) else None for h in heights],
            "source": "Environment Agency 1 m 2022 composite DTM (OGL v3.0)",
        },
        "buildingHeightEvidence": report,
    }
    args.output.write_text(json.dumps(package, separators=(",", ":"), allow_nan=False) + "\n")
    print(f"Terrain {z.shape[1]}×{z.shape[0]} at {spacing} m, {np.isfinite(heights).sum()} valid; "
          f"{len(report)} footprints sampled, {sum(r['candidateForReview'] for r in report.values())} candidates")


if __name__ == "__main__":
    main()
