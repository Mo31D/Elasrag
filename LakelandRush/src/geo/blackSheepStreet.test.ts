import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import type {WorldChunkData} from '../types/game';
import {BLACK_SHEEP_BUILDING,BLACK_SHEEP_FRONT_EDGE,BLACK_SHEEP_DOOR,streetEdge,lakeRoadCentre,lakeRoadKerbs,lakeRoadPavements,lakeRoadLineSegments,LAKE_ROAD_HALF_WIDTH} from './blackSheepStreet';
const chunk=JSON.parse(readFileSync(new URL('../../public/regions/windermere/chunks/0_-3.json',import.meta.url),'utf8')) as WorldChunkData;
test('Black Sheep and solicitor frontages occupy the full street-facing edge, not its short chamfer',()=>{
 const b=chunk.buildings.find(b=>b.id===BLACK_SHEEP_BUILDING)!;
 const e=streetEdge(b,BLACK_SHEEP_FRONT_EDGE);
 assert.ok(e.length>9&&e.length<11);assert.ok(e.nx>.99);
 const u=(BLACK_SHEEP_DOOR.x-e.x)*Math.cos(e.yaw)-(BLACK_SHEEP_DOOR.z-e.z)*Math.sin(e.yaw);
 assert.ok(u>0&&u<e.length/2);
 assert.ok(Math.abs(BLACK_SHEEP_DOOR.z+1400.388)<.6);
});
test('kerbs, road lines and pavement coordinates stay finite and road paint remains on the carriageway',()=>{
 for(const p of [...lakeRoadKerbs(),...lakeRoadPavements(),...lakeRoadLineSegments()])assert.ok(p.length>=3&&p.every(v=>v.every(Number.isFinite)));
 for(const p of lakeRoadLineSegments())for(const [x,z] of p)assert.ok(Math.abs(x-lakeRoadCentre(z))<LAKE_ROAD_HALF_WIDTH);
});

import {usesReferenceStreetBuilding,referenceStreetBuilding,facadeWindowFits,BLACK_SHEEP_EAVES_HEIGHT} from './blackSheepStreet';
test('legacy Black Sheep asset is excluded and both upper storeys have masonry support',()=>{
 const mapped=chunk.buildings.find(b=>b.id===BLACK_SHEEP_BUILDING)!;
 const model=referenceStreetBuilding(mapped);
 assert.ok(usesReferenceStreetBuilding(mapped.id));
 assert.equal(model.h-1.6,BLACK_SHEEP_EAVES_HEIGHT);
 assert.equal(model.levels,3);
 assert.deepEqual(model.pts,mapped.pts);
 assert.equal(facadeWindowFits(8.2,.17,6.72,1.52),true);
 assert.equal(facadeWindowFits(4.8,.17,6.72,1.52),false);
 assert.equal(usesReferenceStreetBuilding(123),false);
});
