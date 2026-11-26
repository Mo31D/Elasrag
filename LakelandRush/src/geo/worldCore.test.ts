import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { buildGameplayRoad } from '../engine/worldBuilder';
import navigation from '../data/ambleside-navigation.json';
import { bngToWorld, worldToBng, type WorldCore } from './worldCore';
import type { RoadFeature } from '../types/game';

const read = (name: string) => JSON.parse(readFileSync(new URL(`../../public/world-core/${name}`, import.meta.url),'utf8'));
const world: WorldCore = read('ambleside-v2.json');
const packed: {tiles: Record<string,RoadFeature[]>} = read('road-tiles-v2.json');

test('World Core coordinates round trip in the adapter', () => {
  for (const [x,z] of [[0,0],[147,-525],[-424,-2090],[71,-1400]]) {
    const [rx,rz] = bngToWorld(world,worldToBng(world,[x,z]));
    assert.ok(Math.hypot(x-rx,z-rz)<1e-7);
  }
});

test('every consecutive approach node pair remains in the source network', () => {
  const edges = new Set<string>();
  for (const id of world.layers.roads) {
    const {nodeIds} = world.ways[id];
    nodeIds.slice(1).forEach((n,i)=>{const prev=nodeIds[i];edges.add(`${prev}:${n}`);edges.add(`${n}:${prev}`);});
  }
  for (const route of navigation.approaches) {
    route.nodeIds.slice(1).forEach((n,i)=> assert.ok(edges.has(`${route.nodeIds[i]}:${n}`),route.id));
  }
});

test('rendered ribbon edges meet across road tile boundaries', () => {
  const roads = Object.values(packed.tiles).flat();
  let seams = 0;
  for (const part of roads) {
    if (!part.afterTile) continue;
    const edge = part.pts.at(-1)!;
    const next = roads.find(road => road.id===part.id && road.pts[0][0]===edge[0] && road.pts[0][1]===edge[1]);
    assert.ok(next,`Unpaired tile boundary for way ${part.id}`);
    const a = buildGameplayRoad(part,null)!;
    const b = buildGameplayRoad(next,null)!;
    const aa=a.attributes.position, bb=b.attributes.position;
    for(let i=0;i<2;i++){
      const j=aa.count-2+i;
      assert.ok(Math.hypot(aa.getX(j)-bb.getX(i),aa.getY(j)-bb.getY(i),aa.getZ(j)-bb.getZ(i))<.002,
        `Road ribbon discontinuity in way ${part.id}`);
    }
    a.dispose();b.dispose();seams++;
  }
  assert.ok(seams>100);
});

test('pilot businesses reference distinct mapped locations and buildings', () => {
  for (const business of world.entities.filter(e=>e.kind==='business')) {
    const premises = world.entities.find(entity=>entity.id===business.premisesId);
    assert.ok(premises?.buildingRef && world.ways[premises.buildingRef]);
    assert.ok(world.layers.places.some(p=>typeof p==='object' && p.id===premises?.locationRef));
  }
});
