import assert from 'node:assert/strict';
import test from 'node:test';
import { backgroundArchitecture } from '../engine/architecture';
import { doorstep, SHOPS, shopAtDoor } from '../data/shopEntrances';
import type { BuildingFeature } from '../types/game';

test('infill roof stays inside its footprint and facade includes door and openings',()=>{
  const building = {id:1,kind:'cottage',cx:4,cz:-4,h:6,
    pts:[[-4,-3],[4,-3],[4,3],[-4,3]]} as BuildingFeature;
  const result = backgroundArchitecture(building,2,[]);
  assert.ok(result);
  const roof = result.tiles.getAttribute('position');
  let low=Infinity, high=-Infinity;
  for(let i=0;i<roof.count;i++){
    assert.ok(roof.getX(i)>=0 && roof.getX(i)<=8);
    assert.ok(roof.getZ(i)>=-7 && roof.getZ(i)<=-1);
    low=Math.min(low,roof.getY(i)); high=Math.max(high,roof.getY(i));
  }
  assert.ok(high-low>1);
  assert.ok(result.joinery.getAttribute('position').count>0);
  assert.ok(result.glazing.getAttribute('position').count>0);
  for(const mesh of Object.values(result))mesh.dispose();
});

test('each pilot shop has an approach outside its own authored doorway',()=>{
  for(const shop of SHOPS){
    assert.equal(shopAtDoor(...doorstep(shop))?.id,shop.id);
    assert.equal(shopAtDoor(shop.door[0]-shop.outward[0],shop.door[1]-shop.outward[1]),undefined);
  }
});
