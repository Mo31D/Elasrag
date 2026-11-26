import posterMetadata from '../assets/mo-poster-hotspots.js';

// Use Blender's camera projection and the actual object-fit painted rectangle.
// The static fallback retains the same meaningful selectors as the WebGL model.
export function posterPositions(width, height) {
  const scale = Math.min(width / posterMetadata.width, height / posterMetadata.height);
  const paintedWidth = posterMetadata.width * scale, paintedHeight = posterMetadata.height * scale;
  return Object.entries(posterMetadata.anchors).map(([id, point]) => ({
    id, x: (width-paintedWidth)/2 + point.x*paintedWidth,
    y: (height-paintedHeight)/2 + point.y*paintedHeight,
  }));
}

export function mountPosterPoints(documentRoot) {
  const poster = documentRoot.querySelector('#engine-poster');
  const container = documentRoot.querySelector('#capability-hotspots');
  const buttons = new Map([...container.querySelectorAll('[data-capability]')].map(button=>[button.dataset.capability,button]));
  const abort = new AbortController();
  function refresh() {
    if (documentRoot.body.dataset.experience === 'ready') return;
    const {width,height} = poster.getBoundingClientRect();
    if (!width || !height) return;
    for (const point of posterPositions(width,height)) {
      const button = buttons.get(point.id);
      if (!button) continue;
      button.hidden = false;
      button.style.left = `${point.x}px`;
      button.style.top = `${point.y}px`;
    }
    container.hidden = false;
  }
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(refresh) : null;
  observer?.observe(poster);
  poster.addEventListener('load',refresh,{signal:abort.signal});
  documentRoot.defaultView.addEventListener('resize',refresh,{signal:abort.signal});
  refresh();
  return { refresh, dispose() { observer?.disconnect(); abort.abort(); } };
}
