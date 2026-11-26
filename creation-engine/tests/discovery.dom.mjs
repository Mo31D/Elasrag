import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseHTML } from 'linkedom';

const html = await readFile(new URL('../../index.html', import.meta.url), 'utf8');
const { CAPABILITIES } = await import('../src/capabilities.js');
const { createInteraction } = await import('../src/interaction.js');

// LinkeDOM supplies the actual page DOM and event dispatch, not browser layout.
// Only viewport/scroll/focus APIs are stubbed because they require a renderer.
function fixture() {
  const { document, window } = parseHTML(html);
  let activeElement = document.body;
  const focusCalls = [];
  const scrollCalls = [];
  Object.defineProperty(document, 'activeElement', { configurable: true, get: () => activeElement });
  window.HTMLElement.prototype.focus = function(options) {
    activeElement = this;
    focusCalls.push({ element: this, options });
  };
  document.querySelector('#experience').getBoundingClientRect = () => ({ top: -1200, bottom: 2400 });
  globalThis.innerHeight = 844;
  globalThis.scrollY = 1200;
  globalThis.scrollTo = options => scrollCalls.push(options);
  globalThis.matchMedia = () => ({ matches: false });
  return { document, window, focusCalls, scrollCalls };
}

// Import only the independent discovery controller. No Three.js, GLTF, WebGL,
// canvas or main renderer module is loaded during these integration checks.
const initial = fixture();
globalThis.document = initial.document;
const { createDiscovery, discovery: initialDiscovery } = await import('../src/discovery.js');
initialDiscovery.dispose();

function click(window, element) {
  element.dispatchEvent(new window.Event('click', { bubbles: true, cancelable: true }));
}

test('all five real hotspot buttons disclose their distinct content and action', () => {
  const f = fixture();
  const controller = createDiscovery(f.document);
  const notifications = [];
  controller.subscribe(id => notifications.push(id));
  const titles = new Set();
  for (const [id, content] of Object.entries(CAPABILITIES)) {
    const trigger = f.document.querySelector(`#capability-hotspots [data-capability="${id}"]`);
    assert.ok(trigger, `Actual homepage contains ${id} hotspot`);
    click(f.window, trigger);
    assert.equal(controller.selected, id);
    assert.equal(f.document.body.dataset.selection, id);
    assert.equal(f.document.querySelector('#capability-panel').hidden, false);
    for (const key of ['kicker', 'title', 'description']) {
      assert.equal(f.document.querySelector(`#capability-${key}`).textContent, content[key]);
    }
    const example = f.document.querySelector('#capability-example');
    assert.equal(example.textContent, content.example);
    assert.equal(example.getAttribute('href'), content.href);
    assert.equal(example.hidden, false);
    for (const button of f.document.querySelectorAll('[data-capability]')) {
      assert.equal(button.getAttribute('aria-expanded'), String(button.dataset.capability === id));
      assert.equal(button.getAttribute('aria-controls'), 'capability-panel');
    }
    assert.equal(f.document.activeElement.id, 'capability-panel');
    assert.deepEqual(f.focusCalls.at(-1).options, { preventScroll: true });
    titles.add(content.title);
  }
  assert.equal(titles.size, 5, 'Choices reveal five different explanations');
  assert.deepEqual(notifications, Object.keys(CAPABILITIES));
  assert.equal(f.scrollCalls.length, 0, 'Visible hotspot choices preserve scroll position');
  controller.dispose();
});

test('directory buttons work without WebGL and scroll to the explanation', () => {
  const f = fixture();
  const controller = createDiscovery(f.document);
  const directory = [...f.document.querySelectorAll('#capability-directory [data-capability]')];
  assert.equal(directory.length, 4);
  for (const trigger of directory) {
    click(f.window, trigger);
    assert.equal(controller.selected, trigger.dataset.capability);
    assert.equal(f.document.querySelector('#capability-panel').hidden, false);
    assert.deepEqual(f.scrollCalls.at(-1), { top: 0, behavior: 'smooth' });
  }
  assert.equal(f.scrollCalls.length, 4);
  controller.dispose();
});

test('Escape and close button restore focus and clear disclosure state', () => {
  const f = fixture();
  const controller = createDiscovery(f.document);
  const trigger = f.document.querySelector('#capability-directory [data-capability="ai"]');
  const notifications = [];
  controller.subscribe(id => notifications.push(id));
  click(f.window, trigger);
  const escape = new f.window.Event('keydown', { bubbles: true, cancelable: true });
  Object.defineProperty(escape, 'key', { value: 'Escape' });
  f.document.dispatchEvent(escape);
  assert.equal(escape.defaultPrevented, true);
  assert.equal(controller.selected, null);
  assert.equal(f.document.body.hasAttribute('data-selection'), false);
  assert.equal(f.document.querySelector('#capability-panel').hidden, true);
  assert.equal(f.document.activeElement, trigger);
  for (const button of f.document.querySelectorAll('[data-capability]')) assert.equal(button.getAttribute('aria-expanded'), 'false');
  click(f.window, trigger);
  click(f.window, f.document.querySelector('[data-action="close-capability"]'));
  assert.equal(controller.selected, null);
  assert.equal(f.document.activeElement, trigger);
  assert.deepEqual(notifications, ['ai', null, 'ai', null]);
  controller.dispose();
});

test('invalid IDs are harmless; close(false) and unsubscribe preserve caller control', () => {
  const f = fixture();
  const controller = createDiscovery(f.document);
  assert.equal(controller.select('missing'), false);
  assert.equal(controller.selected, null);
  const trigger = f.document.querySelector('#capability-hotspots [data-capability="mo"]');
  const notifications = [];
  const unsubscribe = controller.subscribe(id => notifications.push(id));
  controller.select('mo', trigger);
  unsubscribe();
  controller.close(false);
  assert.equal(controller.selected, null);
  assert.deepEqual(notifications, ['mo']);
  assert.equal(f.document.activeElement.id, 'capability-panel', 'close(false) does not move focus');
  controller.dispose();
});

test('a second touch cannot rotate or release the first pointer gesture', () => {
  const f = fixture();
  const previousWindow = globalThis.window;
  globalThis.window = f.window;
  const canvas = f.document.querySelector('#engine-canvas');
  canvas.getBoundingClientRect = () => ({left:0,top:0,width:400,height:400});
  canvas.setPointerCapture = () => {};
  const interaction = createInteraction(canvas, () => {});
  function pointer(target,type,id,primary,x=100,y=100) {
    const event = new f.window.Event(type, {bubbles:true});
    Object.assign(event,{pointerId:id,isPrimary:primary,button:0,pointerType:'touch',clientX:x,clientY:y});
    target.dispatchEvent(event);
  }
  try {
    pointer(canvas,'pointerdown',1,true);
    assert.equal(interaction.state.dragging,true);
    pointer(canvas,'pointermove',2,false,200,200);
    assert.equal(interaction.state.x,0);
    assert.equal(interaction.state.y,0);
    pointer(f.window,'pointerup',2,false);
    assert.equal(interaction.state.dragging,true);
    pointer(canvas,'pointermove',1,true,130,110);
    assert.ok(Math.abs(interaction.state.y-.21)<.0001);
    pointer(f.window,'pointerup',1,true);
    assert.equal(interaction.state.dragging,false);
    pointer(canvas,'pointerdown',2,false);
    assert.equal(interaction.state.dragging,false);
  } finally {
    interaction.dispose();
    globalThis.window = previousWindow;
  }
});
