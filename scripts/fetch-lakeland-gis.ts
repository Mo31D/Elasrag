/** Refresh regional OSM vectors and the coarse OpenTopoData background.
 * Environment Agency terrain and roof evidence are built separately by waterhead-lidar.py.
 */
import fs from 'node:fs';
import path from 'node:path';

// Geographic Origin: Waterhead Pier, Ambleside
const ORIGIN_LAT = 54.4175;
const ORIGIN_LON = -2.9635;
const LAKE_DATUM_M = 39.0; // Windermere surface ~39m AOD

const METERS_PER_DEG_LAT = 111319.5;
const METERS_PER_DEG_LON = 111319.5 * Math.cos((ORIGIN_LAT * Math.PI) / 180);

function projectLatLon(lat: number, lon: number): [number, number] {
  const x = (lon - ORIGIN_LON) * METERS_PER_DEG_LON;
  const z = -(lat - ORIGIN_LAT) * METERS_PER_DEG_LAT; // -Z is North
  return [Math.round(x * 10) / 10, Math.round(z * 10) / 10];
}

// Region Bounds covering all 18km of Windermere + surrounding fells & villages
const REGION_BOUNDS = {
  minLat: 54.258,
  maxLat: 54.442,
  minLon: -3.015,
  maxLon: -2.885,
};

interface OsmNode {
  type: 'node';
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
}

interface OsmWay {
  type: 'way';
  id: number;
  nodes: number[];
  tags?: Record<string, string>;
}

interface OsmRelation {
  type: 'relation';
  id: number;
  members: Array<{ type: string; ref: number; role: string }>;
  tags?: Record<string, string>;
}

type OsmElement = OsmNode | OsmWay | OsmRelation;

const TILE_ZONES: Array<{ name: string; bbox: string }> = [
  { name: 'ambleside_north', bbox: '-2.972,54.426,-2.952,54.438' },
  { name: 'waterhead_ambleside_south', bbox: '-2.972,54.414,-2.952,54.426' },
  { name: 'wray_castle', bbox: '-2.974,54.395,-2.955,54.407' },
  { name: 'brockhole_troutbeck_bridge', bbox: '-2.948,54.387,-2.918,54.404' },
  { name: 'troutbeck', bbox: '-2.920,54.405,-2.898,54.422' },
  { name: 'windermere_town', bbox: '-2.918,54.374,-2.896,54.388' },
  { name: 'bowness_north', bbox: '-2.936,54.364,-2.914,54.375' },
  { name: 'bowness_ferry_nab', bbox: '-2.942,54.351,-2.918,54.364' },
  { name: 'far_sawrey', bbox: '-2.956,54.347,-2.936,54.360' },
  { name: 'near_sawrey', bbox: '-2.980,54.347,-2.956,54.360' },
  { name: 'hawkshead', bbox: '-3.008,54.369,-2.988,54.382' },
  { name: 'lakeside_newby', bbox: '-2.976,54.264,-2.950,54.286' },
];

async function fetchJsonWithRetry(url: string, retries = 6): Promise<any> {
  let lastErr: unknown = new Error(`Failed after ${retries} retries for ${url}`);
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'LakelandRush-GIS/2.0 (DigitalTwinPipeline)',
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(25000),
      });
      if (res.status === 429) {
        lastErr = new Error(`HTTP 429 for ${url}`);
        await new Promise((r) => setTimeout(r, 3000 * (i + 1)));
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return await res.json();
    } catch (err) {
      lastErr = err;
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    }
  }
  throw lastErr;
}

async function fetchElevationGrid() {
  const rows = 42;
  const cols = 32;
  const coords: Array<{ lat: number; lon: number }> = [];
  for (let r = 0; r < rows; r++) {
    const lat = REGION_BOUNDS.minLat + (r / (rows - 1)) * (REGION_BOUNDS.maxLat - REGION_BOUNDS.minLat);
    for (let c = 0; c < cols; c++) {
      const lon = REGION_BOUNDS.minLon + (c / (cols - 1)) * (REGION_BOUNDS.maxLon - REGION_BOUNDS.minLon);
      coords.push({ lat, lon });
    }
  }

  console.log(`Fetching Copernicus EU-DEM 25m basin grid (${rows}x${cols} = ${coords.length} points)...`);
  const elevations: number[] = new Array(coords.length).fill(0);
  const batchSize = 100;

  for (let i = 0; i < coords.length; i += batchSize) {
    const batch = coords.slice(i, i + batchSize);
    const locs = batch.map((p) => `${p.lat.toFixed(5)},${p.lon.toFixed(5)}`).join('|');
    const url = `https://api.opentopodata.org/v1/eudem25m?locations=${encodeURIComponent(locs)}`;
    const data = await fetchJsonWithRetry(url);
    if (Array.isArray(data?.results)) {
      for (let j = 0; j < data.results.length; j++) {
        const rawElev = data.results[j]?.elevation;
        const elev = typeof rawElev === 'number' ? rawElev : LAKE_DATUM_M;
        elevations[i + j] = Math.round((elev - LAKE_DATUM_M) * 10) / 10;
      }
    }
    process.stdout.write('.');
    await new Promise((r) => setTimeout(r, 1100));
  }
  console.log(' done!');

  const minCorner = projectLatLon(REGION_BOUNDS.minLat, REGION_BOUNDS.minLon);
  const maxCorner = projectLatLon(REGION_BOUNDS.maxLat, REGION_BOUNDS.maxLon);

  return {
    rows,
    cols,
    minX: minCorner[0],
    maxX: maxCorner[0],
    minZ: maxCorner[1],
    maxZ: minCorner[1],
    lakeDatumM: LAKE_DATUM_M,
    heights: elevations,
  };
}

function stitchClosedRings(ways: Array<Array<[number, number]>>): Array<Array<[number, number]>> {
  const remaining = ways.map((w) => [...w]);
  const rings: Array<Array<[number, number]>> = [];
  const ptEq = (a: [number, number], b: [number, number]) =>
    Math.abs(a[0] - b[0]) < 1.5 && Math.abs(a[1] - b[1]) < 1.5;

  while (remaining.length > 0) {
    const current = remaining.shift()!;
    let changed = true;
    while (changed && !ptEq(current[0], current[current.length - 1])) {
      changed = false;
      const tail = current[current.length - 1];
      for (let i = 0; i < remaining.length; i++) {
        const cand = remaining[i];
        if (ptEq(tail, cand[0])) {
          current.push(...cand.slice(1));
          remaining.splice(i, 1);
          changed = true;
          break;
        } else if (ptEq(tail, cand[cand.length - 1])) {
          current.push(...cand.slice(0, -1).reverse());
          remaining.splice(i, 1);
          changed = true;
          break;
        }
      }
    }
    if (current.length >= 4) {
      const simplified: Array<[number, number]> = [current[0]];
      for (let i = 1; i < current.length - 1; i++) {
        const prev = simplified[simplified.length - 1];
        const dx = current[i][0] - prev[0];
        const dz = current[i][1] - prev[1];
        if (dx * dx + dz * dz >= 64) simplified.push(current[i]);
      }
      simplified.push(current[current.length - 1]);
      if (simplified.length >= 4) rings.push(simplified);
    }
  }
  return rings;
}

async function fetchWindermereLake() {
  console.log('Fetching real Windermere Lake multipolygon (OSM relation 451948)...');
  const data = await fetchJsonWithRetry('https://api.openstreetmap.org/api/0.6/relation/451948/full');
  const elements: OsmElement[] = data.elements || [];
  const nodeMap = new Map<number, [number, number]>();
  const wayMap = new Map<number, OsmWay>();
  let rel: OsmRelation | undefined;

  for (const el of elements) {
    if (el.type === 'node') nodeMap.set(el.id, projectLatLon(el.lat, el.lon));
    else if (el.type === 'way') wayMap.set(el.id, el);
    else if (el.type === 'relation' && el.id === 451948) rel = el;
  }

  const outerWays: Array<Array<[number, number]>> = [];
  const innerWays: Array<Array<[number, number]>> = [];
  if (rel) {
    for (const m of rel.members) {
      if (m.type === 'way') {
        const w = wayMap.get(m.ref);
        if (!w) continue;
        const pts = w.nodes.map((nid) => nodeMap.get(nid)).filter((p): p is [number, number] => Boolean(p));
        if (pts.length < 2) continue;
        if (m.role === 'inner') innerWays.push(pts);
        else outerWays.push(pts);
      }
    }
  }

  const outerRings = stitchClosedRings(outerWays);
  const innerRings = stitchClosedRings(innerWays);
  console.log(`Lake Windermere: ${outerRings.length} outer ring(s), ${innerRings.length} island ring(s)`);
  return { outerRings, innerRings };
}

function classifyBuilding(tags: Record<string, string>): string {
  const b = (tags.building || '').toLowerCase();
  const tourism = (tags.tourism || '').toLowerCase();
  const amenity = (tags.amenity || '').toLowerCase();
  const shop = tags.shop || '';
  if (tourism === 'hotel' || tourism === 'guest_house' || tourism === 'hostel') return 'hotel';
  if (amenity === 'pub' || amenity === 'restaurant' || amenity === 'cafe' || amenity === 'bank' || shop) return 'shop';
  if (b === 'church' || b === 'chapel' || tags.historic || b === 'public' || b === 'civic') return 'historic';
  if (b === 'boathouse' || b === 'barn' || b === 'farm_auxiliary' || b === 'garage') return 'boathouse';
  if (b === 'terrace' || b === 'apartments' || b === 'commercial' || b === 'retail') return 'stone_terrace';
  return 'cottage';
}

function classifyPoiCategory(tags: Record<string, string>) {
  const a = (tags.amenity || '').toLowerCase();
  const s = (tags.shop || '').toLowerCase();
  const t = (tags.tourism || '').toLowerCase();
  if (a === 'cafe' || a === 'ice_cream') return 'cafe';
  if (a === 'pub' || a === 'bar') return 'pub';
  if (a === 'restaurant' || a === 'fast_food') return 'restaurant';
  if (a === 'bank') return 'bank';
  if (s === 'bakery' || s === 'confectionery') return 'bakery';
  if (s === 'outdoor' || s === 'sports') return 'outdoor';
  if (t === 'hotel' || t === 'guest_house' || t === 'hostel') return 'hotel';
  if (t === 'attraction' || t === 'museum' || t === 'information') return 'attraction';
  if (tags.historic) return 'historic';
  if (s) return 'shop';
  return 'other';
}

function inferMaterial(tags: Record<string, string>, zone: string): string {
  const mat = (tags['building:material'] || '').toLowerCase();
  const col = (tags['building:colour'] || '').toLowerCase();
  if (mat.includes('render') || mat.includes('plaster') || mat.includes('stucco') || col === 'white' || col === 'cream') {
    return 'whitewash';
  }
  if (mat.includes('wood') || mat.includes('timber')) return 'timber';
  if (mat.includes('sandstone') || col === 'beige') return 'sandstone';
  if (zone === 'hawkshead' || zone === 'far_sawrey' || zone === 'near_sawrey') {
    return (tags.building === 'terrace' || tags.shop) ? 'slate_stone' : 'whitewash';
  }
  return 'slate_stone';
}

function estimateBuildingHeight(
  tags: Record<string, string>,
  kind: string,
): { h: number; levels?: number; source: 'osm_tag' | 'estimated' } {
  const parsedLevels = tags['building:levels'] ? parseFloat(tags['building:levels']) : NaN;
  const levels = !Number.isNaN(parsedLevels) && parsedLevels > 0 && parsedLevels < 12 ? parsedLevels : undefined;

  if (tags.height) {
    const parsed = parseFloat(tags.height);
    if (!Number.isNaN(parsed) && parsed > 2 && parsed < 45) {
      return { h: Math.round(parsed * 10) / 10, levels, source: 'osm_tag' };
    }
  }
  if (levels !== undefined) {
    return { h: Math.round((levels * 3.0 + 1.6) * 10) / 10, levels, source: 'osm_tag' };
  }
  if (kind === 'historic') return { h: 12.2, levels: 3, source: 'estimated' };
  if (kind === 'hotel') return { h: 10.6, levels: 3, source: 'estimated' };
  if (kind === 'shop') return { h: 8.8, levels: 2, source: 'estimated' };
  if (kind === 'boathouse') return { h: 5.0, levels: 1, source: 'estimated' };
  if (kind === 'stone_terrace') return { h: 8.6, levels: 2, source: 'estimated' };
  return { h: 6.4, levels: 2, source: 'estimated' };
}

function classifyRoad(tags: Record<string, string>): string | null {
  const hw = tags.highway;
  if (tags.route === 'ferry') return 'ferry';
  if (tags.railway) return 'railway';
  if (!hw) return null;
  if (hw === 'primary' || hw === 'trunk' || hw === 'primary_link') return 'primary';
  if (hw === 'secondary' || hw === 'tertiary') return 'secondary';
  if (hw === 'residential' || hw === 'unclassified' || hw === 'service') return 'lane';
  if (
    hw === 'footway' ||
    hw === 'path' ||
    hw === 'pedestrian' ||
    hw === 'cycleway' ||
    hw === 'track' ||
    hw === 'steps'
  ) {
    return 'footpath';
  }
  return null;
}



async function fetchZoneTiles() {
  const buildings: any[] = [];
  const roads: any[] = [];
  const walls: any[] = [];
  const piers: any[] = [];
  const waterways: any[] = [];
  const woodlands: any[] = [];
  const pois: any[] = [];
  const streetProps: any[] = [];
  const parks: any[] = [];
  const seenWays = new Set<string>();
  const seenNodes = new Set<number>();

  for (const zone of TILE_ZONES) {
    console.log(`Fetching OSM zone: ${zone.name} (${zone.bbox})...`);
    const url = `https://api.openstreetmap.org/api/0.6/map?bbox=${zone.bbox}`;
    const data = await fetchJsonWithRetry(url);
    const elements: OsmElement[] = data.elements || [];
    const nodeMap = new Map<number, { x: number; z: number; lat: number; lon: number }>();

    for (const el of elements) {
      if (el.type === 'node') {
        const [x, z] = projectLatLon(el.lat, el.lon);
        nodeMap.set(el.id, { x, z, lat: el.lat, lon: el.lon });

        if (el.tags && !seenNodes.has(el.id)) {
          seenNodes.add(el.id);
          const t = el.tags;
          // Street infrastructure nodes
          if (t.highway === 'street_lamp') {
            streetProps.push({ id: el.id, kind: 'street_lamp', x, z });
          } else if (t.highway === 'crossing') {
            streetProps.push({ id: el.id, kind: 'crossing', x, z });
          } else if (t.highway === 'bus_stop' || t.public_transport === 'platform') {
            streetProps.push({ id: el.id, kind: 'bus_stop', x, z, name: t.name });
          } else if (t.amenity === 'bench') {
            streetProps.push({ id: el.id, kind: 'bench', x, z });
          } else if (t.amenity === 'post_box') {
            streetProps.push({ id: el.id, kind: 'post_box', x, z });
          } else if (t.natural === 'tree') {
            streetProps.push({ id: el.id, kind: 'tree', x, z });
          }

          // Commercial & Landmark Node POIs
          if (
            t.name &&
            (t.shop || t.amenity === 'cafe' || t.amenity === 'pub' || t.amenity === 'restaurant' ||
              t.amenity === 'ice_cream' || t.amenity === 'bank' || t.tourism === 'hotel' ||
              t.tourism === 'guest_house' || t.tourism === 'attraction' || t.tourism === 'museum' ||
              t.historic)
          ) {
            pois.push({
              id: el.id,
              name: t.name,
              category: classifyPoiCategory(t),
              x,
              z,
              outdoorSeating: t.outdoor_seating === 'yes',
              street: t['addr:street'] || undefined,
              verification: 'verified_geo_approx',
            });
          }
        }
      }
    }

    for (const el of elements) {
      if (el.type !== 'way' || !el.tags) continue;
      const key = `w_${el.id}`;
      if (seenWays.has(key)) continue;
      seenWays.add(key);

      const rawNodes = el.nodes
        .map((nid) => nodeMap.get(nid))
        .filter((p): p is { x: number; z: number; lat: number; lon: number } => Boolean(p));
      if (rawNodes.length < 2) continue;
      const pts: Array<[number, number]> = rawNodes.map((n) => [n.x, n.z]);

      const tags = el.tags;
      if (tags.building && pts.length >= 4) {
        const ring = rawNodes.slice(0, -1);
        let cx = 0;
        let cz = 0;
        for (const p of ring) {
          cx += p.x;
          cz += p.z;
        }
        cx /= ring.length;
        cz /= ring.length;

        const kind = classifyBuilding(tags);
        const hInfo = estimateBuildingHeight(tags, kind);
        const bName = tags.name || undefined;
        const bObj = {
          id: el.id,
          zone: zone.name,
          name: bName,
          kind,
          cx: Math.round(cx * 10) / 10,
          cz: Math.round(cz * 10) / 10,
          h: hInfo.h,
          levels: hInfo.levels,
          heightSource: hInfo.source,
          material: inferMaterial(tags, zone.name),
          wallColour: tags['building:colour'] || undefined,
          roofShape: tags['roof:shape'] || undefined,
          roofColour: tags['roof:colour'] || undefined,
          shopType: tags.shop || undefined,
          amenity: tags.amenity || undefined,
          tourism: tags.tourism || undefined,
          historic: tags.historic || undefined,
          streetName: tags['addr:street'] || undefined,
          verification:
            'verified_geo_approx',
          pts: ring.map((p) => [Math.round((p.x - cx) * 10) / 10, Math.round((p.z - cz) * 10) / 10]),
        };
        buildings.push(bObj);

        if (
          bName &&
          (tags.shop || tags.amenity === 'cafe' || tags.amenity === 'pub' || tags.amenity === 'restaurant' ||
            tags.tourism === 'hotel' || tags.tourism === 'hostel' || tags.tourism === 'museum' ||
            tags.tourism === 'attraction' || tags.historic)
        ) {
          pois.push({
            id: -el.id,
            name: bName,
            category: classifyPoiCategory(tags),
            x: bObj.cx,
            z: bObj.cz,
            buildingId: el.id,
            outdoorSeating: tags.outdoor_seating === 'yes',
            street: tags['addr:street'] || undefined,
            verification: bObj.verification,
          });
        }
      } else if (tags.man_made === 'pier' || tags.leisure === 'marina') {
        piers.push({ id: el.id, name: tags.name || undefined, pts });
      } else if (tags.barrier === 'wall' || tags.barrier === 'dry_stone_wall') {
        if (pts.length >= 2) walls.push({ id: el.id, pts });
      } else if (tags.waterway === 'river' || tags.waterway === 'stream') {
        waterways.push({ id: el.id, name: tags.name || undefined, kind: tags.waterway, pts });
      } else if (tags.natural === 'wood' || tags.landuse === 'forest') {
        if (pts.length >= 4) {
          let cx = 0;
          let cz = 0;
          for (const p of pts) {
            cx += p[0];
            cz += p[1];
          }
          cx /= pts.length;
          cz /= pts.length;
          woodlands.push({ id: el.id, cx: Math.round(cx), cz: Math.round(cz), pts });
        }
      } else if (
        (tags.leisure === 'park' || tags.landuse === 'meadow' || tags.landuse === 'retail' || tags.amenity === 'parking') &&
        pts.length >= 4
      ) {
        let cx = 0;
        let cz = 0;
        for (const p of pts) {
          cx += p[0];
          cz += p[1];
        }
        cx /= pts.length;
        cz /= pts.length;
        const pKind =
          tags.leisure === 'park'
            ? 'park'
            : tags.landuse === 'retail'
              ? 'retail'
              : tags.amenity === 'parking'
                ? 'car_park'
                : 'meadow';
        parks.push({
          id: el.id,
          name: tags.name || undefined,
          kind: pKind,
          cx: Math.round(cx),
          cz: Math.round(cz),
          pts,
        });
      } else {
        const roadKind = classifyRoad(tags);
        if (roadKind) {
          const parsedWidth = tags.width ? parseFloat(tags.width) : NaN;
          roads.push({
            id: el.id,
            zone: zone.name,
            name: tags.name || tags.ref || undefined,
            ref: tags.ref || undefined,
            kind: roadKind,
            bridge: tags.bridge === 'yes',
            oneway: tags.oneway === 'yes',
            sidewalk: Boolean(tags.sidewalk && tags.sidewalk !== 'no'),
            lit: tags.lit === 'yes',
            surface: tags.surface || undefined,
            widthM: !Number.isNaN(parsedWidth) && parsedWidth > 1 && parsedWidth < 25 ? parsedWidth : undefined,
            pts,
          });
        }
      }
    }
  }

  // Link standalone node POIs to nearest host building within 16m
  for (const poi of pois) {
    if (poi.buildingId) continue;
    let bestId: number | undefined;
    let bestD = 16 * 16;
    for (const b of buildings) {
      const dx = b.cx - poi.x;
      const dz = b.cz - poi.z;
      const d2 = dx * dx + dz * dz;
      if (d2 < bestD) {
        bestD = d2;
        bestId = b.id;
      }
    }
    if (bestId) poi.buildingId = bestId;
  }

  console.log(
    `Extracted: ${buildings.length} buildings, ${pois.length} commercial POIs, ${roads.length} roads/paths, ` +
      `${streetProps.length} street props, ${parks.length} parks, ${walls.length} walls, ${piers.length} piers, ` +
      `${waterways.length} waterways, ${woodlands.length} woodlands`,
  );
  return { buildings, roads, walls, piers, waterways, woodlands, pois, streetProps, parks };
}

async function main() {
  const output = process.argv[2];
  if (!output) throw new Error('Pass an output directory to stage the regional data refresh.');
  const outDir = path.resolve(output);
  fs.mkdirSync(path.join(outDir, 'chunks'), { recursive: true });

  const [terrain, lake, zones] = await Promise.all([
    fetchElevationGrid(),
    fetchWindermereLake(),
    fetchZoneTiles(),
  ]);

  const CHUNK_SIZE = 500;
  const chunkMap = new Map<string, any>();

  const getChunk = (x: number, z: number) => {
    const cx = Math.floor(x / CHUNK_SIZE);
    const cz = Math.floor(z / CHUNK_SIZE);
    const key = `${cx}_${cz}`;
    let c = chunkMap.get(key);
    if (!c) {
      c = {
        key,
        cx,
        cz,
        buildings: [],
        roads: [],
        walls: [],
        piers: [],
        woodlands: [],
        pois: [],
        streetProps: [],
        parks: [],
      };
      chunkMap.set(key, c);
    }
    return c;
  };

  for (const b of zones.buildings) getChunk(b.cx, b.cz).buildings.push(b);
  for (const r of zones.roads) {
    const mid = r.pts[Math.floor(r.pts.length / 2)];
    getChunk(mid[0], mid[1]).roads.push(r);
  }
  for (const w of zones.walls) {
    const mid = w.pts[Math.floor(w.pts.length / 2)];
    getChunk(mid[0], mid[1]).walls.push(w);
  }
  for (const p of zones.piers) {
    const mid = p.pts[Math.floor(p.pts.length / 2)];
    getChunk(mid[0], mid[1]).piers.push(p);
  }
  for (const wl of zones.woodlands) getChunk(wl.cx, wl.cz).woodlands.push(wl);
  for (const poi of zones.pois) getChunk(poi.x, poi.z).pois.push(poi);
  for (const sp of zones.streetProps) getChunk(sp.x, sp.z).streetProps.push(sp);
  for (const pk of zones.parks) getChunk(pk.cx, pk.cz).parks.push(pk);

  for (const [key, chunk] of chunkMap.entries()) {
    fs.writeFileSync(path.join(outDir, 'chunks', `${key}.json`), JSON.stringify(chunk));
  }

  const settlements = [
    { id: 'ambleside', name: 'Ambleside', lat: 54.4287, lon: -2.9615, kind: 'town' },
    { id: 'waterhead', name: 'Waterhead', lat: 54.4175, lon: -2.9635, kind: 'pier' },
    { id: 'wray_castle', name: 'Wray Castle', lat: 54.4003, lon: -2.9648, kind: 'landmark' },
    { id: 'brockhole', name: 'Brockhole', lat: 54.3958, lon: -2.9422, kind: 'landmark' },
    { id: 'troutbeck_bridge', name: 'Troutbeck Bridge', lat: 54.3912, lon: -2.9225, kind: 'village' },
    { id: 'troutbeck', name: 'Troutbeck', lat: 54.4135, lon: -2.9055, kind: 'village' },
    { id: 'windermere', name: 'Windermere', lat: 54.3795, lon: -2.9065, kind: 'town' },
    { id: 'bowness', name: 'Bowness-on-Windermere', lat: 54.3645, lon: -2.9205, kind: 'town' },
    { id: 'belle_isle', name: 'Belle Isle', lat: 54.361, lon: -2.9375, kind: 'island' },
    { id: 'ferry_nab', name: 'Ferry Nab', lat: 54.3555, lon: -2.9305, kind: 'ferry' },
    { id: 'claife_heights', name: 'Claife Heights', lat: 54.367, lon: -2.956, kind: 'fell' },
    { id: 'far_sawrey', name: 'Far Sawrey', lat: 54.3515, lon: -2.9465, kind: 'village' },
    { id: 'near_sawrey', name: 'Near Sawrey', lat: 54.353, lon: -2.9685, kind: 'village' },
    { id: 'hawkshead', name: 'Hawkshead', lat: 54.3745, lon: -2.999, kind: 'village' },
    { id: 'lakeside', name: 'Lakeside', lat: 54.2795, lon: -2.957, kind: 'pier' },
    { id: 'newby_bridge', name: 'Newby Bridge', lat: 54.267, lon: -2.9685, kind: 'village' },
  ].map((s) => {
    const [x, z] = projectLatLon(s.lat, s.lon);
    return { ...s, x, z };
  });

  const manifest = {
    id: 'windermere',
    name: 'Windermere & Lake District',
    origin: { lat: ORIGIN_LAT, lon: ORIGIN_LON, lakeDatumM: LAKE_DATUM_M },
    chunkSize: CHUNK_SIZE,
    availableChunks: Array.from(chunkMap.keys()),
    settlements,
    attribution: [
      'Map data © OpenStreetMap contributors (ODbL)',
      'Basin elevation: Copernicus EU-DEM 25m via OpenTopoData',
    ],

  };

  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest));
  fs.writeFileSync(path.join(outDir, 'terrain.json'), JSON.stringify(terrain));
  fs.writeFileSync(path.join(outDir, 'lake.json'), JSON.stringify({ ...lake, waterways: zones.waterways }));

  console.log(
    `Digital Twin GIS pipeline complete! ${chunkMap.size} chunks, ${zones.pois.length} mapped POIs written to ${outDir}`,
  );
}

main().catch((err) => {
  console.error('GIS fetch failed:', err);
  process.exit(1);
});
