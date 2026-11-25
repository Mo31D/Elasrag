# ELASRAG — The Creation Engine

An original real-time 3D mechanical sculpture for the ELASRAG homepage. One reusable assembly evolves from a point and sampled structural particles, through a construction wireframe and exploded build, to a finished titanium engine. The homepage remains ordinary accessible HTML; essential identity, work and contact content never depend on WebGL.

## Run and verify

The site is buildless. Serve the repository root through an HTTP static server; ES modules and the GLB should not be opened through `file://`. On a normal development machine, for example:

```sh
python3 -m http.server 3000 --bind 0.0.0.0
```

Open `http://localhost:3000/`. The repository's existing `npm start` runs a different Express application serving `mo/`; it is intentionally unchanged and should not be used to preview this homepage.

On the managed Codex environment, use its supported `sites-preview` mechanism. Preview transport availability is an environment capability, separate from syntax or unit-test results. See the final QA report for actual browser coverage and any remaining verification limits.

No npm install, build command, CDN, remote model, texture server, backend, API key or paid service is needed to serve the homepage. Three.js and the small required add-on modules are vendored with their MIT license.

Run the deterministic checks from the repository root:

```sh
node --test creation-engine/tests/*.test.mjs
node creation-engine/tools/check-scope.mjs
node --check creation-engine/src/main.js
```

The tests check the timeline's endpoints, semantic stage targets, normalized state ranges, continuity and reversibility, plus the GLB's self-contained binary structure, component metadata, shaft separation and PBR material assignments. They do not substitute for browser, device or visual testing.

For a deterministic fallback check, open `/?engine=fallback`. This deliberately bypasses WebGL initialization and displays the original rendered poster while retaining page content and contact links. Also test with JavaScript disabled and a browser configured to emulate `prefers-reduced-motion: reduce`.

## Source map

| File | Responsibility |
| --- | --- |
| `../index.html` | Semantic homepage content, mount, accessible controls, local import map |
| `style.css` | Desktop, tablet and mobile exhibition composition and reduced-motion styles |
| `src/bootstrap.js` | Dependency-free entry that keeps the still homepage usable if module loading fails |
| `src/main.js` | Lifecycle, native-scroll chapter mapping, UI state, loading/failure fallback |
| `src/scene.js` | Renderer, camera, reusable asset composition and resize |
| `src/asset.js` | GLB loading, structural particle samples, wireframe construction and component animation |
| `src/lighting.js` | Local procedural studio environment, key/rim/fill and core illumination |
| `src/timeline.js` | Pure reversible state function and chapter metadata |
| `src/interaction.js` | Mouse/touch/keyboard rotation, bounded zoom and reset |
| `src/performance.js` | Capability profile, pixel-density caps and measured frame-rate quality adaptation |
| `tools/generate_engine.py` | Editable Blender geometry/material generation source |
| `tools/ASSET.md` | Component hierarchy, coordinates, pivots, materials and asset rebuild reference |
| `assets/creation-engine.glb` | Original self-contained web-ready asset |
| `assets/engine.blend` | Editable Blender scene with studio setup |
| `assets/engine-poster.webp` | Immediate lightweight still view before rendering and on failure |
| `docs/homepage-before.html` | Exact recoverable original homepage |
| `docs/REPOSITORY.md` | Existing deployment architecture, protected route inventory and recovery |

## Asset lifecycle

The GLB contains a named model root and 16 independently pivoted mechanical component roots. Each root carries glTF `extras` with `component: true`, a semantic `role`, and an XYZ `explode` vector. Materials, bevels and normals are embedded; no textures are required. The main shaft is the model's Z axis.

The loader saves each component's assembled position and orientation. Every frame derives the displayed position from that saved position plus its explosion displacement; animation does not accumulate positional drift. Front and rear shaft components separate in opposite directions, radial field pods move outward, and gimbal bands retain their initial mounting orientation. Rotor and gimbal motion is added to the original pivots after assembly.

Wireframe construction is generated from the same mesh geometry. Idea particles sample positions on that same assembly, then form from the centre. There are no unrelated substitute objects between chapters. A single pure `creationState(progress)` function drives all representations; state depends on native scroll position, so reversing the scroll reverses the transformation.

Rebuild the editable model and GLB with Blender:

```sh
blender -b --python creation-engine/tools/generate_engine.py
```

Add `-- --render` to regenerate the transparent offline PNG poster. Export the resulting poster as WebP to keep the initial visual lightweight. See [the asset reference](tools/ASSET.md) before changing dimensions or axis conventions. Keep source, GLB and poster synchronized when regenerating the model.

## Interaction and accessibility

The opening view presents the completed engine. Native page scrolling then moves through Idea, Design, Build and Reality. Chapter buttons jump to their corresponding scroll positions; they do not replace scrolling or trap the visitor. Areas of work, introduction and contact follow in normal document flow.

- Drag the object with a mouse to rotate; horizontal touch dragging rotates while vertical gestures remain available to page scrolling.
- Use the discrete zoom controls for bounded zoom. Browser/page pinch zoom remains available.
- Toggle Explode for assembly/disassembly and Structure for construction-line viewing.
- Reset restores orientation, zoom and view toggles. Pause suspends the engine's automatic movement.
- Focus the canvas and use arrow keys to rotate or `+` / `-` to zoom.
- Reduced-motion mode suppresses automatic rotation and transition easing. Manual viewing and document navigation remain available.

Control buttons have accessible labels and state attributes. The poster remains visible until a successful first WebGL render. If initialization fails or the context is lost, the poster and ordinary homepage remain. With JavaScript disabled, the homepage displays its still composition without requiring interaction.

## Performance and resource ownership

The renderer caps pixel ratio based on viewport, memory/CPU hints and save-data preference. Transmission is reduced on mobile/constrained devices. Frame-rate samples can lower or restore rendering density within bounds. Rendering stops while the experience is outside the viewport or the document is hidden; paused/reduced-motion states request frames only for changes. This targets responsive interaction but does not itself prove 60 FPS on any specific physical device.

The GLB is approximately 2.9 MB and carries six materials with no texture downloads. Geometry is joined by component/material in the Blender export. Runtime construction edges and sampled particles are generated once after asset loading. Disposal releases geometry, materials, environment texture, renderer, event listeners and observers.

For development profiling, read the optional browser diagnostic function:

```js
window.creationEngineDiagnostics?.()
```

It reports sampled FPS, renderer pixel ratio, draw calls, triangle count, chapter, pause/reduced-motion and visibility state. It does not upload telemetry.

## Modification and future expansion

Change homepage prose in `index.html`, visual composition in `style.css`, chapter timing in `src/timeline.js`, and lighting/camera in their dedicated modules. Keep the scroll range synchronized with the four `STAGES` positions when changing choreography. Run the timeline tests after timing changes.

To replace the sculpture, preserve the root/component extras contract and material names used by `src/asset.js` for glass and emission detection, or update that loader explicitly. Keep root transforms as assembled reference transforms. This lets the camera, controls, lifecycle and chapter UI operate independently of a particular model.

Add future demonstrations as separate scene/asset modules with explicit loading and disposal rather than embedding them in `index.html`. Digital twins or physics simulations should introduce separately verified constraints and data; the current sculpture is a coherent visual artefact and does not claim physical energy simulation. No speculative future features or external services are installed in this generation.

## Deployment and recovery

The existing root GitHub Pages/CNAME architecture is preserved. Commit only `index.html` and `creation-engine/**` on the dedicated development branch. Review the preview and actual QA evidence before merging into `main`. No root package, deployment workflow, application route or API configuration needs replacement.

Before release:

```sh
node --test creation-engine/tests/*.test.mjs
node creation-engine/tools/check-scope.mjs
git diff --stat 88277c7b170d41c164e7338659bf018d4653917a
```

For recovery, restore the exact original homepage from `creation-engine/docs/homepage-before.html` and deploy through the existing repository process. See [the repository audit](docs/REPOSITORY.md) for the preserved applications and hosting evidence.
