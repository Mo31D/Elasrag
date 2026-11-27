import test from 'node:test';
import assert from 'node:assert/strict';
import inventory from '../data/ambleside-business-inventory.json';
import { AREAS, inside, CATEGORY_NAMES } from './placeIdentity';

test('inventory preserves every imported business without fabricated positions',()=>{
  assert.equal(inventory.records.length,241);
  assert.equal(new Set(inventory.records.map(r=>r.id)).size,241);
  const area=AREAS.find(a=>a.id==='ambleside')!;
  for(const r of inventory.records){
    assert.ok(r.name&&r.sourceUrls);
    assert.ok(r.mapCategory in CATEGORY_NAMES);
    if(r.position){
      assert.equal(r.status,'mapped-snapshot-match');
      assert.ok(Number.isFinite(r.position.x)&&Number.isFinite(r.position.z));
      assert.ok(inside(area,r.position.x,r.position.z));
      assert.ok(r.position.source&&r.position.method);
    }else assert.notEqual(r.status,'mapped-snapshot-match');
  }
  assert.equal(inventory.counts.mapped,inventory.records.filter(r=>r.position).length);
  assert.equal(inventory.counts.unlocated,inventory.records.filter(r=>r.status==='unlocated').length);
  assert.equal(inventory.counts.ambiguous,inventory.records.filter(r=>r.status==='ambiguous').length);
});
