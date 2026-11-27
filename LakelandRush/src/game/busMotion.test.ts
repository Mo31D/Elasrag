import test from 'node:test';import assert from 'node:assert/strict';import {busRoute,busPose,busFits,stepBus} from './busMotion';
const route=busRoute([[0,0],[0,-100]]);
test('left-hand lane, forward and reverse throttle',()=>{let s={distance:20,lane:1.85,speed:0,dir:1 as const};assert.ok(busPose(route,s).x<0);for(let i=0;i<100;i++)s=stepBus(route,s,1,0,.04,()=>true) as typeof s;assert.ok(s.distance>35);for(let i=0;i<100;i++)s=stepBus(route,s,-1,1,.04,()=>true) as typeof s;assert.ok(s.speed<0);assert.ok(s.lane>=1.55);});
test('bus sweep stops hull before obstacle',()=>{let s={distance:20,lane:1.85,speed:10,dir:1 as const};for(let i=0;i<100;i++)s=stepBus(route,s,1,0,.04,(_x,z)=>z>-40) as typeof s;assert.ok(s.distance<=35);assert.ok(busFits(busPose(route,s),(_x,z)=>z>-40));});
