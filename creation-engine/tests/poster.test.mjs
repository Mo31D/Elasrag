import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import metadata from '../assets/mo-poster-hotspots.js';
import { posterPositions } from '../src/poster-points.js';
import { CAPABILITIES } from '../src/capabilities.js';

test('poster selectors preserve the exact camera export and all public capability IDs', async () => {
  const source = JSON.parse(await readFile(new URL('../assets/mo-poster-hotspots.json',import.meta.url),'utf8'));
  assert.deepEqual(metadata,source);
  assert.deepEqual(Object.keys(metadata.anchors).sort(),Object.keys(CAPABILITIES).sort());
  for (const point of Object.values(metadata.anchors)) assert.ok(point.x>0 && point.x<1 && point.y>0 && point.y<1);
});

test('object-fit letterboxing keeps every poster selector on its painted image at desktop and phone sizes', () => {
  for (const [width,height] of [[950,650],[448,363],[431,247],[368,193],[1200,1200]]) {
    const points=posterPositions(width,height), size=Math.min(width,height);
    for (const point of points) {
      const normalized=metadata.anchors[point.id];
      assert.ok(Math.abs(point.x-((width-size)/2+normalized.x*size))<.0001);
      assert.ok(Math.abs(point.y-((height-size)/2+normalized.y*size))<.0001);
      assert.ok(point.x>=0 && point.x<=width && point.y>=0 && point.y<=height);
    }
  }
});
