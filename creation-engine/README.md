# ELASRAG — The Creation Engine

A personal, interactive 3D signature for Mohamed El-Asrag — Mo. A bevelled **M** sits inside an open **O** framework, with four tactile selectors for technology, AI, design and strategy. Selecting a part reveals a concise explanation and a corresponding spatial diagram. The same reusable assembly also evolves from a point and structural particles through wireframe and exploded build to its finished form. Essential identity, work and contact content remain ordinary accessible HTML.

## Run and verify

Deployment is static: the committed production bundle and stylesheet have content-hashed filenames, preventing stale browser/CDN modules from mixing releases. Serve the repository root through an HTTP static server; ES modules and the GLB should not be opened through `file://`. On a normal development machine, for example:

```sh
python3 -m http.server 3000 --bind 0.0.0.0
```

Open `http://localhost:3000/`. The repository's existing `npm start` runs a different Express application serving `mo/`; it is intentionally unchanged and should not be used to preview this homepage.

On the managed Codex environment, use its supported `sites-preview` mechanism. Preview transport availability is an environment capability, separate from syntax or unit-test results. See the final QA report for actual browser coverage and any remaining verification limits.

No npm install, build command, CDN, remote model, texture server, backend, API key or paid service is needed on the hosting service. After editing source, rebuild and commit the generated runtime files locally: `npm ci --prefix creation-engine && npm --prefix creation-engine run build`. The isolated esbuild development dependency bundles the local Three.js source; it is not a browser dependency. Three.js and the small required add-on modules are vendored with their MIT license.

Run the deterministic checks from the repository root:

```sh
node --test creation-engine/tests/*.test.mjs
node creation-engine/tools/check-scope.mjs
node --check creation-engine/src/main.js
```

The tests check timeline endpoints, semantic stage targets, normalized ranges, continuity and reversibility; safe capability content/actions and click-versus-drag thresholds; and both original assets’ self-contained GLB structure, component metadata and geometry budgets. They do not substitute for browser, device or visual testing.

For a deterministic fallback check, open `/?engine=fallback`. This deliberately bypasses WebGL initialization and displays the original rendered poster while retaining page content and contact links. Also test with JavaScript disabled and a browser configured to emulate `prefers-reduced-motion: reduce`.

## Source map

| File | Responsibility |
| --- | --- |
| `../index.html` | Semantic homepage content, mount, accessible controls, hashed production entry |
| `style.css` | Desktop, tablet and mobile exhibition composition and reduced-motion styles |
| `src/bootstrap.js` | Load the renderer-independent discovery controller before attempting the 3D dependency graph |
| `src/main.js` | Lifecycle, native-scroll chapters, selection coordination, raycast gesture dispatch and fallback |
| `src/capabilities.js` | Shared public capability IDs, bounded personal copy, safe action targets and click-versus-drag discrimination |
| `src/discovery.js` | Semantic directory/hotspot buttons, accessible detail panel, Escape/close and focus restoration without WebGL |
| `src/signals.js` | Original miniature 3D explanations: interface layers, AI network, design construction and strategy route |
| `src/scene.js` | Renderer, camera, raycast selection, HTML hotspot projection, reusable asset composition and resize |
| `src/asset.js` | GLB loading, structural particle samples, wireframe construction and component animation |
| `src/lighting.js` | Local procedural studio environment, key/rim/fill and core illumination |
| `src/timeline.js` | Pure reversible state function and chapter metadata |
| `src/interaction.js` | Mouse/touch/keyboard rotation, bounded zoom and reset |
| `src/poster-points.js` | Camera-derived HTML selector positions when WebGL is unavailable |
| `src/performance.js` | Capability profile, pixel-density caps and measured frame-rate quality adaptation |
| `tools/generate_mo_signature.py` | Primary personal M/O sculpture: editable Blender geometry/material source |
| `tools/MO-ASSET.md` | Primary model hierarchy, capability IDs, selector-face anchors, materials and rebuild reference |
| `assets/mo-signature.glb` | Primary self-contained interactive personal model |
| `assets/mo-signature.blend` | Editable personal sculpture with offline studio setup |
| `assets/mo-poster.webp` | Immediate personal-model still before rendering and on failure |
| `tools/generate_engine.py`, `tools/ASSET.md` | Preserved initial axial Creation Engine source/reference |
| `assets/creation-engine.glb`, `engine.blend`, `engine-poster.*` | Preserved first asset generation, reusable independently and no longer loaded by the homepage |
| `docs/homepage-before.html` | Exact recoverable original homepage |
| `docs/REPOSITORY.md` | Existing deployment architecture, protected route inventory and recovery |

## Asset lifecycle

The primary GLB has a named `ELASRAG_MO_Signature` root and seven independent component pivots: `Mo_Core`, `O_Frame`, `Connection_Bridges`, and four capability nodes. Five component roots carry capability IDs matching `src/capabilities.js`. The four selector nodes also carry local `hotspot` offsets for projecting ordinary HTML button anchors onto the selector faces. Every component has a semantic role and XYZ explosion vector. Five PBR materials, bevels and normals are embedded; no texture downloads are required.

The loader saves each assembled position and orientation. Every frame derives the displayed position from that reference plus its explosion displacement. Selection gently actuates the selected cartridge and brings its 3D explanation into the monogram’s central negative space; the M becomes subdued while a work diagram is open. The independent construction timeline can still disassemble and reassemble the personal object without cumulative positional drift.

The first axial engine remains in `assets/creation-engine.glb` with its `.blend`, poster and procedural generator. It is an archived original asset rather than an extra runtime download. Its independent tests remain in place, preserving the initial engineering investment while the homepage uses the personal signature.

Wireframe construction is generated from the same mesh geometry. Idea particles sample positions on that same assembly, then form from the centre. There are no unrelated substitute objects between chapters. A single pure `creationState(progress)` function drives all representations; state depends on native scroll position, so reversing the scroll reverses the transformation.

Rebuild the editable model and GLB with Blender:

```sh
blender -b --python creation-engine/tools/generate_mo_signature.py
```

Add `-- --render` to regenerate the transparent offline PNG poster. Export the resulting poster as WebP to keep the initial visual lightweight. See [the personal asset reference](tools/MO-ASSET.md) before changing dimensions, capability IDs or axis conventions. Keep source, GLB and poster synchronized when regenerating the model.

## Interaction and accessibility

The opening view presents Mo’s completed M/O signature. Click a physical selector, its anchored labelled HTML button, or an area-of-work directory button to explore a capability. Clicking the personal M reveals Mo’s introduction. Content is sourced from the same small capability record for every entry path. A short stationary click/tap selects; movement or a long press is treated as a different gesture. Raycasting handles physical meshes; semantic buttons provide an equivalent keyboard and screen-reader route.

The discovery controller initializes before the renderer and has no renderer dependency. If WebGL, the GLB or Three.js fails, the work directory and personal introduction can still open their text panel against the poster. Escape and the visible close button restore the prior trigger’s focus. Without JavaScript, the normal work, introduction and contact content stays readable.

Native page scrolling moves through Idea, Design, Build and Reality. Chapter buttons jump to their corresponding scroll positions without trapping page movement. Areas of work, introduction and contact follow in normal document flow.

- Drag with a mouse to rotate; horizontal touch dragging rotates while vertical gestures remain available to page scrolling.
- Use discrete bounded zoom controls. Browser/page pinch zoom remains available.
- Toggle Explode for assembly/disassembly and Structure for construction-line viewing.
- Reset closes discovery and restores orientation, zoom and view toggles. Pause suspends automatic movement.
- Focus the canvas and use arrow keys to rotate or `+` / `-` to zoom. Focus the labelled point/directory buttons to select a capability.
- Reduced-motion mode suppresses automatic movement and transition easing. Manual viewing and document navigation remain available.

Control buttons have accessible labels and state attributes. The poster remains visible until a successful first WebGL render. If initialization fails or the context is lost, the poster and ordinary homepage remain. With JavaScript disabled, the homepage displays its still composition without requiring interaction.

## Performance and resource ownership

The renderer caps pixel ratio based on viewport, memory/CPU hints and save-data preference. The asset loader can reduce transmission for glass-bearing assets on mobile/constrained devices; the primary personal sculpture uses no glass. Frame-rate samples can lower or restore rendering density within bounds. Rendering stops while the experience is outside the viewport or the document is hidden; paused/reduced-motion states request frames only for changes. This targets responsive interaction but does not itself prove 60 FPS on any specific physical device.

The primary GLB is 1,181,008 bytes with 46,232 triangles, 32 material primitives and five materials. Its WebP poster is approximately 108 KB; there are no texture downloads. Geometry is joined by component/material in the Blender export. Runtime construction edges and sampled particles are generated once after asset loading. Disposal releases geometry, materials, environment texture, renderer, event listeners and observers.

For development profiling, read the optional browser diagnostic function:

```js
window.creationEngineDiagnostics?.()
```

It reports sampled FPS, renderer pixel ratio, draw calls, triangle count, chapter, selected capability, pause/reduced-motion and visibility state. It does not upload telemetry.

## Modification and future expansion

Change persistent homepage prose in `index.html`, capability-panel content/actions in `src/capabilities.js`, visual composition in `style.css`, chapter timing in `src/timeline.js`, and lighting/camera in their dedicated modules. Keep public capability IDs synchronized across model extras, directory/hotspot buttons and diagram IDs in `signals.js`. Keep the scroll range synchronized with the four `STAGES` positions when changing choreography. Run the timeline tests after timing changes.

To replace the sculpture, preserve the root/component/capability extras contract, local hotspot offsets and material names used by `src/asset.js` for emission detection, or update that loader explicitly. Transform local hotspot coordinates through the component world matrix before projecting to HTML screen coordinates. Keep `discovery.js` independent of all renderer modules so content selection remains available when 3D loading fails. Keep root transforms as assembled reference transforms. This lets the camera, controls, lifecycle and chapter UI operate independently of a particular model.

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

## Production cache and graceful interaction

`npm run build` inside this directory bundles `src/bootstrap.js` into `runtime/home-[content-hash].js`, copies the stylesheet to a content-hashed path and updates only the homepage references. This keeps a production release coherent even when earlier modules remain in browser/CDN caches. All editable modules and vendored licensing remain preserved. Commit generated runtime files alongside source changes; Pages only serves the committed static output.

When WebGL cannot initialize, all five selectors remain interactive over the poster. Their coordinates are exported from the exact Blender camera to `assets/mo-poster-hotspots.json` and its synchronous `.js` counterpart, then mapped through the poster's actual object-fit painted rectangle. Regenerating the personal asset also regenerates this metadata. The live renderer owns projection when running; the poster controller yields to it. This fallback was added during public browser validation on an environment whose GPU disables WebGL.
