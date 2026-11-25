# Ambleside and Waterhead accuracy

The two main road approaches split at OSM node 232013. The east approach follows the A591 Lake Road for 1,144.7 m to the town-centre junction. The west approach follows the A5075 Borrans Road and A593 Rothay Road for 1,409.3 m to a different town-centre junction. Old Lake Road is a separate 602.9 m local bypass off the east approach. These lengths are along the imported graph. The arcade route follows real roads from south of Waterhead to the Bridge House area, approximately 1,823.7 m.

The fresh import keeps 695 ways within the audited corridor. It shares 690 with the previous build, adds five way IDs and records 578 graph junction nodes. Across 4,346 shared source vertices, the old rendering centrelines were on average 0.027 m from the new OSM centreline, with a 0.053 m 95th percentile and 0.068 m maximum. The updated export's maximum coordinate round-trip difference from the projected OSM inputs is 0.0007 m. These figures measure consistency with source coordinates and rounding. Absolute centreline and building positioning accuracy, a 1% real-world tolerance, route edge tolerances, surveyed road widths and all pavement and kerb positions remain unverified. Widths use numeric OSM tags where available and game defaults elsewhere. Bridge deck grades use DTM endpoint estimates. OSM routing tags are retained as metadata, while exploration remains on foot.

The corridor now samples 152,714 valid 4 m elevation nodes, derived from Environment Agency 1 m composite DTM in British National Grid (EPSG:27700), Ordnance Datum Newlyn. The game uses the 39.0 m ODN lake datum and preserves the earlier Waterhead survey nodes. NoData areas continue to use the existing distant terrain. The 4 m grid does not resolve individual kerbs, and no new corridor-wide DSM roof measurement is claimed.

- [OSM snapshot](https://api.openstreetmap.org/api/0.6/map.json?bbox=-2.978,54.417,-2.950,54.437)
- [Road comparison numbers and snapshot hash](references/ambleside-road-audit.json)
- [Local highway authority road plans](https://www.westmorlandandfurness.gov.uk/sites/default/files/2025-08/South%20Lakeland%20Speed%20Limit%20Traffic%20Regulation%20Order%202025%20No.2%20-%20Plans.pdf)
- [Environment Agency elevation dataset](https://environment.data.gov.uk/dataset/13787b9a-26a4-4775-8523-806d13af58fc)

## Landmark status

| Location | Geography | Appearance |
| --- | --- | --- |
| Black Sheep Shop, 2 Lancaster House | OSM shop node 4231695543 and host footprint 423598927; FSA address | Original provisional storefront and sign. Bay widths, joinery, roof and interior layout await owner references |
| Bridge House | OSM way 389884072 over Stock Beck | Original photo-informed model; estimated window, gable, stairs and arch dimensions |
| Market Cross | OSM historic node 423190096 | Original photo-informed model; estimated shaft and stepped plinth dimensions |
| Lakeside Picnic | Existing OSM frontage and parent footprint | Existing photo-informed Waterhead model retained |
| Hill’s filling station | OSM fuel forecourt and canopy | Mapped roof outline and ground apron, estimated height, pumps and fascia |
| Tesco Express, Co-op, Galava, Rothay Park, Rothay Bridge, Lake Road Car Park | Mapped fast-travel locations | Site context and background geometry; dedicated reference-led modelling remains open |

Sources for the landmark assets include [the Black Sheep Shop FSA record](https://ratings.food.gov.uk/business/726802), [Bridge House by David Dixon](https://commons.wikimedia.org/wiki/File:Bridge_House%2C_Ambleside_-_geograph.org.uk_-_1733267.jpg) and [Market Cross by Alexander P Kapp](https://commons.wikimedia.org/wiki/File:Market_cross%2C_Ambleside_-_geograph.org.uk_-_1553077.jpg). The two photographs are CC BY-SA 2.0 and were used as visual references. The models use original geometry and shared materials. The photos are not bundled. Google Street View and Google Business 360 imagery were not used.

## Photographs still needed

- Black Sheep Shop exterior. Straight-on full height from across Lake Road, both oblique approaches with adjoining shop bays, a close view of the threshold and sign, and one measured width or doorway dimension.
- Black Sheep Shop interior. Doorway looking in, opposite end looking back, both side walls showing shelves, counter from both sides, and a dimensioned sketch showing entrances, aisles and changes of level.
- Bridge House and Market Cross. Contemporary opposite-side views, a clear view of the gable and stairs on Bridge House, and width or height references for both landmarks.
- Hill’s, Tesco Express, Co-op and Galava. Current street-level frontage and approach views, including entries and adjacent pavements. For Galava, obtain current views of surviving walls and paths from public access points.

## Reproduction

Run `python scripts/import-ambleside-osm.py snapshot.json --baseline /path/to/pre-upgrade/regions/windermere --retrieved 2026-11-25`. Preserve the source snapshot hash when comparing results. Checkout `d68055bc8b75b08b9e6faa114b3b9407e471d6be` to get the exact previous region.

The Ambleside GeoTIFF input is a British National Grid clip with easting 336850–338650 and northing 503375–505235. Run `/usr/bin/python3 scripts/build-ambleside-terrain.py ambleside-dtm.tif waterhead-dtm.tif --ostn15-dir /path/to/grid`. See the shipped terrain header for the input tile hashes and the existing Waterhead download script for the WCS coverage and grid sources. Regenerate original models with `blender -b -t 2 --python-exit-code 1 -P scripts/build-ambleside-landmarks.py`.

## Business-to-business route

The 1,105 m Lakeside Picnic → The Black Sheep Shop course follows connected OSM public walking ways between the selected exterior spawn points. The two short custom links between those spawns and the mapped graph total approximately 10 m. Choose it in the challenge list or highlight it from the Ambleside & Waterhead map and start the course there.
