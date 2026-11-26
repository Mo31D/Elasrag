import { clamp } from './timeline.js';

export function createInteraction(canvas, onChange) {
  const abort = new AbortController();
  const options = { signal: abort.signal };
  const state = { x: 0, y: 0, zoom: 1, parallaxX: 0, parallaxY: 0, lastInput: performance.now(), dragging: false };
  let origin = null;
  const notify = () => { state.lastInput = performance.now(); onChange(); };
  canvas.addEventListener('pointerdown', e => {
    if (!e.isPrimary || e.button !== 0) return;
    origin = { x: e.clientX, y: e.clientY, rotationX: state.x, rotationY: state.y, type: e.pointerType, pointerId:e.pointerId };
    state.dragging = true;
    if (e.pointerType !== 'touch') canvas.setPointerCapture(e.pointerId);
    notify();
  }, options);
  canvas.addEventListener('pointermove', e => {
    const bounds = canvas.getBoundingClientRect();
    if (origin) {
      if (e.pointerId !== origin.pointerId) return;
      const dx = e.clientX - origin.x, dy = e.clientY - origin.y;
      // Let vertical touch gestures continue the page's native scroll.
      if (origin.type === 'touch' && Math.abs(dy) > Math.abs(dx) * 1.25) return;
      state.y = origin.rotationY + dx * .007;
      state.x = clamp(origin.rotationX + dy * .005, -.9, .9);
      notify();
    } else if (e.pointerType === 'mouse') {
      state.parallaxX = (e.clientX - bounds.left) / bounds.width - .5;
      state.parallaxY = (e.clientY - bounds.top) / bounds.height - .5;
      onChange();
    }
  }, options);
  const end = event => {
    if (origin && event.pointerId !== undefined && event.pointerId !== origin.pointerId) return;
    origin = null; state.dragging = false;
  };
  window.addEventListener('pointerup', end, options);
  window.addEventListener('blur', end, options);
  canvas.addEventListener('pointercancel', end, options);
  canvas.addEventListener('pointerleave', () => { state.parallaxX = state.parallaxY = 0; onChange(); }, options);
  canvas.addEventListener('keydown', e => {
    const actions = {
      ArrowLeft: () => state.y -= .14,
      ArrowRight: () => state.y += .14,
      ArrowUp: () => state.x = clamp(state.x - .14, -.9, .9),
      ArrowDown: () => state.x = clamp(state.x + .14, -.9, .9),
      '+': () => state.zoom = clamp(state.zoom + .1, .75, 1.35),
      '=': () => state.zoom = clamp(state.zoom + .1, .75, 1.35),
      '-': () => state.zoom = clamp(state.zoom - .1, .75, 1.35),
    };
    if (actions[e.key]) { e.preventDefault(); actions[e.key](); notify(); }
  }, options);
  return {
    state,
    zoom(delta) { state.zoom = clamp(state.zoom + delta, .75, 1.35); notify(); },
    reset() { state.x = state.y = state.parallaxX = state.parallaxY = 0; state.zoom = 1; notify(); },
    dispose() { abort.abort(); },
  };
}
