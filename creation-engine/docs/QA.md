# Validation record — 25 November 2026

## Verified

- `node creation-engine/tests/timeline.test.mjs`: 4 assertions/tests passed. Checks cover chapter order, the full forward and reverse timeline, bounded channels, dark/completed endpoints, continuity and activation after assembly.
- `node creation-engine/tests/asset.test.mjs`: 3 assertions/tests passed. The actual GLB is self-contained, has 16 semantic component roots with explosion metadata, six PBR materials and valid mesh assignments/normals.
- `node creation-engine/tools/check-source.mjs`: all eight application modules pass Node syntax checks and 15 local import/homepage asset references resolve. Contact destinations are present.
- `node creation-engine/tools/check-scope.mjs`: all 835 protected files from base `88277c7b170d41c164e7338659bf018d4653917a` are byte-identical. The previous homepage backup is exact. New files are confined to `creation-engine/`.
- Blender headless generation/export and a 1200 × 1200 Cycles CPU poster render completed. The rendered asset was opened and visually inspected. This is an offline asset render, **not a browser screenshot**.
- Independent Three.js GLTFLoader parsing of the actual binary succeeded. Mathematical projection of model vertices at representative desktop/mobile canvas sizes found the assembled and fully exploded default views inside the camera frustum. This verifies framing arithmetic, **not rendered layout or touch behaviour**.
- Source review found and corrected short-phone controls extending below the viewport and a discontinuous scale change during explosion. Manual explode/structure transitions now interpolate; pause freezes idle motion; canvas keyboard focus has a visible outline.
- `git diff --cached --check` passed after source whitespace fixes.

## Preview and HTTP checks

A private, isolated review deployment was created at:

https://elasrag-creation-engine-review.elasrag.chatgpt.site

The Sites deployment operation reported `succeeded`. Authenticated HTTP probes verified 200 responses for homepage HTML, stylesheet, scene orchestration, Three.js, GLTFLoader, GLB and fallback WebP with expected sizes/content types. This is service/asset delivery validation only.

The source copy for this review is separate from the GitHub repository. Its hosting manifest and preview helper files do not modify `CNAME`, production workflows, repository package configuration or any existing route. `elasrag.com` remains on its original homepage until the development PR is reviewed and merged through the existing release process.

## Unverified / release gate

The managed local preview CLI failed because its browser relay timed out. No alternative preview server or browser installation was substituted. The hosted private review opened in Chrome at its expected sign-in gate; the test session was signed out. A sign-in handoff was requested. No browser rendering, UI interaction, browser console or visual-layout result is claimed from that gate.

Consequently the following remain **unverified**:

- Actual Chrome, Firefox and Safari rendering; physical iPhone/iPad Safari compatibility.
- Live forward/reverse scroll, drag/touch rotation, zoom, exploded/assembled and solid/wireframe controls, pause/resume and reset.
- Browser-level WebGL failure/context-loss, JavaScript-disabled and reduced-motion behaviour.
- Real device FPS, GPU load, resource disposal and off-screen suspension.
- Desktop, tablet and mobile webpage screenshots, including the four transformation stages. They have **not** been captured. `assets/engine-poster.webp` is the available offline reference render.

Do not merge to production on the strength of unit/source checks alone. Complete the browser checklist below after opening the review with the owner account or serving the branch on a normal development machine.

## Browser acceptance checklist

1. Test 1440×900 desktop, 768×1024 tablet, 390×844 phone, 375×667 short phone and landscape. Check headings, engine bounds, 44px control targets, visible focus and contact links; no horizontal page overflow.
2. Capture the opening view, then each stage. Click stage buttons and use native forward/reverse scrolling. Verify one object evolves consistently and that content below the scene remains reachable.
3. Rotate by mouse, horizontal touch and focused-canvas arrow keys. Confirm vertical touch scroll and browser pinch zoom. Use bounded zoom buttons and keyboard +/-.
4. Toggle Explode and Structure, inspect smooth reversible assembly and material/line changes, reset, pause and resume. Check navigation and control accessible names/state.
5. Enable OS/browser reduced motion before loading: no idle movement or timeline easing. Explicit Play may opt into movement. Scroll and content remain usable.
6. Disable JavaScript; force WebGL failure; open `/?engine=fallback`; simulate context loss. Verify poster and content, no empty pinned scroll region. Block a scene module to exercise the dependency-free bootstrap fallback.
7. Inspect console/network for errors and missing assets. Watch `window.creationEngineDiagnostics()` on capable and constrained devices. Verify rendering suspends off-screen/in a hidden document and stays still while paused.
8. Smoke-test existing project routes using the original Pages deployment, then confirm CNAME, API hosting and workflow files remain unchanged before merge.

## Payload / limitations

The web model is 2,978,840 bytes with 137,844 triangles and 55 material primitives. Three.js r170 is vendored and minified (691,648 bytes); GLTFLoader is 110,273 bytes. The initial poster is 211,748 bytes. Source `.blend` and offline PNG are retained for editing but never requested by the homepage. There are no model textures, CDN requests, external telemetry or paid runtime services.

Adaptive pixel density, reduced mobile transmission and rendering suspension are implemented; a 60 FPS target has **not** been measured or guaranteed. Safari and WebGL-capable browser behaviour require the device checks above.
