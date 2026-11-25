import { getCapability } from './capabilities.js';

// This controller has no renderer dependency. The directory remains interactive
// even when WebGL, the model, or Three.js cannot load.
export function createDiscovery(documentRoot = document) {
  const panel = documentRoot.querySelector('#capability-panel');
  const buttons = [...documentRoot.querySelectorAll('[data-capability]')];
  const abort = new AbortController();
  const listeners = new Set();
  let selected = null, origin = null;
  function update(id, trigger) {
    const content = getCapability(id);
    if (!content) return false;
    selected = id;
    origin = trigger || documentRoot.activeElement;
    documentRoot.body.dataset.selection = id;
    for (const key of ['kicker', 'title', 'description']) documentRoot.querySelector(`#capability-${key}`).textContent = content[key];
    const example = documentRoot.querySelector('#capability-example');
    example.textContent = content.example;
    example.setAttribute('href', content.href);
    example.hidden = false;
    panel.hidden = false;
    documentRoot.querySelector('.interaction-hint').textContent = content.detail;
    buttons.forEach(button => button.setAttribute('aria-expanded', String(button.dataset.capability === id)));
    const section = documentRoot.querySelector('#experience');
    const bounds = section.getBoundingClientRect();
    // A work-directory choice brings its explanation into view without trapping
    // subsequent scrolling. Hotspot choices preserve the current scroll position.
    if (trigger?.closest('#capability-directory') || bounds.bottom < 100 || bounds.top > innerHeight) {
      scrollTo({ top: scrollY + bounds.top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
    panel.focus({ preventScroll: true });
    listeners.forEach(listener => listener(id));
    return true;
  }
  function close(restoreFocus = true) {
    if (!selected) return;
    selected = null;
    delete documentRoot.body.dataset.selection;
    panel.hidden = true;
    documentRoot.querySelector('.interaction-hint').textContent = 'Choose a point. See what it means.';
    buttons.forEach(button => button.setAttribute('aria-expanded', 'false'));
    if (restoreFocus && origin?.isConnected) origin.focus({ preventScroll: !origin.closest('#capability-directory') });
    listeners.forEach(listener => listener(null));
  }
  buttons.forEach(button => button.addEventListener('click', () => update(button.dataset.capability, button), { signal: abort.signal }));
  documentRoot.querySelector('[data-action="close-capability"]').addEventListener('click', () => close(), { signal: abort.signal });
  documentRoot.addEventListener('keydown', event => {
    if (event.key === 'Escape' && selected) { event.preventDefault(); close(); }
  }, { signal: abort.signal });
  return {
    get selected() { return selected; },
    select: update, close,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    dispose() { abort.abort(); listeners.clear(); },
  };
}
export const discovery = createDiscovery();
