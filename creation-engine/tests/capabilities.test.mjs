import test from 'node:test';
import assert from 'node:assert/strict';
import { CAPABILITIES, getCapability, isSelectionGesture } from '../src/capabilities.js';

const publicIds = ['technology', 'ai', 'design', 'strategy', 'mo'];

test('public capability IDs resolve to bounded personal descriptions and distinct diagram identities', () => {
  assert.deepEqual(Object.keys(CAPABILITIES).sort(), [...publicIds].sort());
  const diagrams = new Set();
  for (const id of publicIds) {
    const capability = getCapability(id);
    assert.strictEqual(capability, CAPABILITIES[id]);
    for (const field of ['label', 'kicker', 'title', 'description', 'detail', 'example', 'href', 'diagram']) {
      assert.equal(typeof capability[field], 'string', `${id}.${field} is available to semantic UI`);
      assert(capability[field].trim().length > 0);
    }
    assert(capability.label.length <= 20);
    assert(capability.title.length <= 60);
    assert(capability.description.length <= 180, 'Explanations stay brief enough for the discovery panel');
    assert(capability.detail.length <= 100);
    assert(!/guarantee|world[- ]class|award[- ]winning|industry[- ]leading|certified|expert|best[- ]in[- ]class|\d+\s*(?:years|clients|customers)|testimonial/i.test(`${capability.title} ${capability.description} ${capability.detail}`), 'No unsupported superlatives, credentials or business metrics');
    assert(!diagrams.has(capability.diagram), 'Each capability has a distinct diagram identity');
    diagrams.add(capability.diagram);
  }
  assert.match(CAPABILITIES.mo.description, /Mohamed El-Asrag/);
  assert.match(CAPABILITIES.ai.description, /Exploring AI/);
  assert.match(CAPABILITIES.technology.description, /Websites, applications and digital tools/);
});

test('capability links stay within requested contact, existing learning route and homepage anchors', () => {
  const allowed = new Set(['https://elasrag.com/adam/', '#experience', 'mailto:mo@elasrag.com']);
  for (const capability of Object.values(CAPABILITIES)) {
    assert(allowed.has(capability.href), 'Capability actions remain grounded in available routes and contact');
    assert(!/^(?:javascript|data|vbscript):/i.test(capability.href));
    if (capability.href.startsWith('https:')) {
      const url = new URL(capability.href);
      assert.equal(url.origin, 'https://elasrag.com');
      assert.equal(url.pathname, '/adam/');
    }
    if (capability.href.startsWith('mailto:')) assert.equal(capability.href, 'mailto:mo@elasrag.com');
  }
  for (const id of ['missing', '__proto__', 'constructor', 'toString', '', null, undefined]) {
    assert.equal(getCapability(id), null, `Unknown or inherited ID ${String(id)} cannot populate the panel`);
  }
});

test('short mouse clicks and touch taps select; drags and long presses do not', () => {
  const start = { x: 100, y: 200, time: 1000 };
  assert.equal(isSelectionGesture(start, { x: 100, y: 200, time: 1020 }), true, 'A short stationary click selects');
  assert.equal(isSelectionGesture(start, { x: 103, y: 204, time: 1200 }), true, 'A touch tap tolerates small finger movement');
  assert.equal(isSelectionGesture(start, { x: 107.9, y: 200, time: 1699 }), true, 'A short gesture just inside both thresholds selects');
  assert.equal(isSelectionGesture(start, { x: 108, y: 200, time: 1050 }), false, 'Movement at the drag threshold does not select');
  assert.equal(isSelectionGesture(start, { x: 106, y: 206, time: 1050 }), false, 'Diagonal travel uses actual distance');
  assert.equal(isSelectionGesture(start, { x: 100, y: 200, time: 1700 }), false, 'The long-press boundary does not select');
  assert.equal(isSelectionGesture(start, { x: 145, y: 260, time: 1080 }), false, 'Fast rotation/scroll drag never becomes a click');
  assert.equal(isSelectionGesture(null, { x: 100, y: 200, time: 1030 }), false, 'A release without a matching start cannot select');
  assert.equal(isSelectionGesture(start, { x: 100, y: 200, time: 999 }), false, 'Invalid reverse timestamps cannot select');
});
