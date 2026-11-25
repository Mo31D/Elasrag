import { createScene } from './scene.js';
import { createInteraction } from './interaction.js';
import { creationState, STAGES, clamp } from './timeline.js';

const section = document.querySelector('#experience');
const canvas = document.querySelector('#engine-canvas');
const status = document.querySelector('#engine-status');
const controls = document.querySelector('#engine-controls');
const poster = document.querySelector('#engine-poster');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const nav = [...document.querySelectorAll('[data-stage]')];
const abort = new AbortController();
const options = { signal: abort.signal };
let scene, interaction, frame = 0, disposed = false, visible = true;
let paused = motion.matches, reduced = motion.matches, lastFrame = 0, elapsed = 0, cinematic = 0;
let target = creationState(3, true), current = { ...target };
let progress = 3, hero = true, activeStage = -1;
const overrides = { explode: false, wireframe: false };
const visualOverrides = { explode: 0, wireframe: 0 };

function fallback(message = 'A still view of the Creation Engine. All content is available below.') {
  cancelAnimationFrame(frame); frame = 0;
  document.body.dataset.experience = 'fallback';
  document.body.dataset.phase = 'hero';
  poster.style.opacity = '1';
  canvas.style.visibility = 'hidden';
  controls.hidden = true;
  document.querySelector('#explore-engine').hidden = true;
  document.querySelector('.stage-navigation').hidden = true;
  status.textContent = message;
  cleanup();
}

function requestFrame() {
  if (!frame && !disposed && scene && visible && !document.hidden) frame = requestAnimationFrame(tick);
}
function tick(now) {
  frame = 0;
  const dt = lastFrame ? Math.min((now - lastFrame) / 1000, .075) : 1 / 60;
  lastFrame = now;
  if (!paused && !reduced) elapsed += dt;
  let changing = false;
  for (const key in target) {
    const difference = target[key] - current[key];
    current[key] = reduced ? target[key] : current[key] + difference * (1 - Math.exp(-dt * 10));
    changing ||= Math.abs(difference) > .001;
  }
  for (const key in visualOverrides) {
    const difference = Number(overrides[key]) - visualOverrides[key];
    visualOverrides[key] += difference * (reduced ? 1 : 1 - Math.exp(-dt * 7));
    changing ||= Math.abs(difference) > .001;
  }
  const idle = now - interaction.state.lastInput > 4500 && !interaction.state.dragging;
  const desiredCinematic = paused ? cinematic : !reduced && idle ? Math.sin(elapsed * .12) * .12 : 0;
  cinematic += (desiredCinematic - cinematic) * (reduced ? 1 : .035);
  scene.render(current, elapsed, interaction.state, visualOverrides, cinematic, dt);
  if ((!paused && !reduced) || changing || Math.abs(desiredCinematic - cinematic) > .001) requestFrame();
}

function setScrollState() {
  const rect = section.getBoundingClientRect();
  const travel = Math.max(1, section.offsetHeight - innerHeight);
  const fraction = clamp(-rect.top / travel);
  hero = fraction < .12;
  progress = clamp((fraction - .12) / .88 * 3, 0, 3);
  target = creationState(progress, hero);
  const index = hero ? -1 : Math.min(3, Math.floor(progress + .42));
  if (index !== activeStage) {
    activeStage = index;
    document.body.dataset.phase = hero ? 'hero' : STAGES[index].name.toLowerCase();
    if (!hero) {
      document.querySelector('#stage-index').textContent = `0${index + 1}`;
      document.querySelector('#stage-name').textContent = index === 3 ? 'Turning ideas into reality.' : STAGES[index].name;
      document.querySelector('#stage-description').textContent = index === 3 ? '' : STAGES[index].description;
    }
    nav.forEach((button, i) => {
      if (i === index) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
  }
  document.querySelector('#stage-progress').style.transform = `scaleX(${hero ? 0 : progress / 3})`;
  requestFrame();
}
function goToStage(index) {
  const travel = section.offsetHeight - innerHeight;
  const top = scrollY + section.getBoundingClientRect().top;
  const fraction = .12 + STAGES[index].position / 3 * .88;
  // No wheel interception: native page scrolling remains available everywhere.
  scrollTo({ top: top + fraction * travel, behavior: reduced ? 'instant' : 'smooth' });
}
function syncButtons() {
  for (const name of ['explode', 'wireframe']) controls.querySelector(`[data-action="${name}"]`).setAttribute('aria-pressed', String(overrides[name]));
  const pause = controls.querySelector('[data-action="pause"]');
  pause.setAttribute('aria-pressed', String(paused));
  pause.setAttribute('aria-label', paused ? 'Resume engine motion' : 'Pause engine motion');
  pause.title = paused ? 'Resume motion' : 'Pause motion';
}

function cleanup() {
  if (disposed) return;
  disposed = true;
  cancelAnimationFrame(frame);
  abort.abort();
  observer?.disconnect();
  resizeObserver?.disconnect();
  interaction?.dispose();
  scene?.dispose();
}
let observer, resizeObserver;

async function init() {
  if (new URLSearchParams(location.search).get('engine') === 'fallback') { fallback(); return; }
  try {
    scene = await createScene(canvas);
    if (disposed) { scene.dispose(); return; }
    interaction = createInteraction(canvas, requestFrame);
    canvas.removeAttribute('aria-hidden');
    canvas.setAttribute('tabindex', '0');
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Interactive Creation Engine. Drag to rotate. With keyboard focus, use arrow keys to rotate and plus or minus to zoom.');
    document.querySelector('#engine-viewport').removeAttribute('role');
    document.body.dataset.experience = 'ready';
    controls.hidden = false;
    status.textContent = '';
    setScrollState();
    scene.resize();
    // Hide the poster only after a successful first WebGL frame.
    scene.render(current, elapsed, interaction.state, visualOverrides, 0, 1 / 60);
    poster.style.opacity = '0';
    syncButtons();
    window.addEventListener('scroll', setScrollState, { ...options, passive: true });
    nav.forEach((button, index) => button.addEventListener('click', () => goToStage(index), options));
    document.querySelector('#explore-engine').addEventListener('click', () => goToStage(0), options);
    controls.addEventListener('click', event => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      switch (button.dataset.action) {
        case 'explode': overrides.explode = !overrides.explode; break;
        case 'wireframe': overrides.wireframe = !overrides.wireframe; break;
        case 'pause':
          paused = !paused;
          // A deliberate Play action may opt into motion; OS changes still win.
          if (!paused) reduced = false;
          lastFrame = 0;
          break;
        case 'zoom-in': interaction.zoom(.1); break;
        case 'zoom-out': interaction.zoom(-.1); break;
        case 'reset': interaction.reset(); overrides.explode = overrides.wireframe = false; cinematic = 0; break;
      }
      interaction.state.lastInput = performance.now();
      syncButtons(); requestFrame();
    }, options);
    observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      lastFrame = 0;
      if (visible) requestFrame(); else { cancelAnimationFrame(frame); frame = 0; }
    });
    observer.observe(document.querySelector('.experience-stage'));
    resizeObserver = new ResizeObserver(() => { scene.resize(); setScrollState(); });
    resizeObserver.observe(canvas);
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(frame); frame = 0; lastFrame = 0; requestFrame();
    }, options);
    motion.addEventListener('change', event => {
      reduced = event.matches; paused = reduced;
      syncButtons(); requestFrame();
    }, options);
    canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); fallback('The 3D view is unavailable. A still view is shown instead.'); }, options);
    // Diagnostic information is read-only; useful when profiling future revisions.
    window.creationEngineDiagnostics = () => ({ fps: Math.round(scene.monitor.fps), pixelRatio: scene.renderer.getPixelRatio(), drawCalls: scene.renderer.info.render.calls, triangles: scene.renderer.info.render.triangles, stage: hero ? 'hero' : STAGES[activeStage].name, paused, reducedMotion: reduced, visible });
    requestFrame();
  } catch (error) {
    console.warn('Creation Engine could not initialise:', error.message);
    fallback();
  }
}
window.addEventListener('pagehide', event => { if (!event.persisted) cleanup(); }, options);
init();
