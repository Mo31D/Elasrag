# Validation record — personal Mo release review, 26 November 2026

## Verified against the current source

- Five deterministic Node test files pass: 4 timeline tests, 3 preserved original-asset tests, 3 capability/content/gesture tests, 4 personal-MO asset tests and 2 poster-projection tests (**16 total**).
- `npm --prefix creation-engine run test:dom`: **6 integration tests pass** using the actual homepage markup and renderer-independent discovery controller. These exercise all five hotspot selections, distinct content/actions, disclosure attributes, all four directory choices without WebGL, scroll requests, Escape/close, focus API calls invalid IDs, and secondary-touch isolation. LinkeDOM does not render layout; viewport, focus and scrolling APIs are stubbed. These are **DOM tests, not browser interaction tests**.
- `node creation-engine/tools/check-source.mjs`: all 12 modules parse and 22 local source/homepage asset references resolve. Contact destinations are present.
- `node creation-engine/tools/check-scope.mjs`: all 835 protected files from base `88277c7b170d41c164e7338659bf018d4653917a` remain byte-identical; the previous homepage backup is exact.
- Blender headless generation/export and a 1200×1200 CPU poster render completed for the new MO sculpture. The upright poster was opened and visually inspected. It is an **offline render, not a webpage screenshot**.
- Independent Three.js GLTFLoader parsing of the actual new binary succeeded. Projecting all five selector anchors from their real component hierarchy at representative desktop/mobile canvas sizes found them inside the default camera frame. This is a framing calculation, not layout verification.
- Source review corrected the design action so it closes discovery and enters the creation timeline. The learning example points to the canonical existing website so it works from the isolated preview. Local selector-face offsets, monotonic gesture timing, close-animation continuity, directory focus return and a compact 320×568 composition were addressed.
- `git diff --check` passed.

## What changed for the visitor

The primary object is now a personal engineered M inside an open O, with four purpose-built selector cartridges. It replaces the previous turbine-like object in the live scene; all earlier editable assets remain preserved.

Build reveals connected interface layers; Think reveals a branching graph; Design reveals construction geometry; Solve reveals an ordered route. The M fades into the diagram's negative space and the selected component extends. The central selector introduces Mohamed El-Asrag as Mo. Semantic HTML buttons track the real 3D selectors, and mesh raycasting also supports direct selection. Drag and tap gestures are distinguished.

The content controller initializes before the renderer. If rendering fails, the areas-of-work directory can still disclose the same information and links. “Hi, I’m Mo.” and “Mohamed El-Asrag. You can call me Mo.” are visible in the ordinary homepage content.

## Private preview / production boundary

Review URL: https://elasrag-creation-engine-review.elasrag.chatgpt.site

The isolated Site remains owner-private. Its source is a separate copy with its own manifest; production CNAME, workflows, repository package configuration, APIs and existing routes are unchanged. The user authorized production publication on 26 November. PR47 and the reviewed follow-up fixes were merged through the existing main-branch Pages deployment. The homepage is live at https://www.elasrag.com/.

## Browser environment and remaining device coverage

A fresh managed preview retry again failed at the browser relay, even with Chromium running. The private hosted review requires owner sign-in. No alternate server, public access change or browser authentication workaround was substituted.

The managed GPU cannot create a WebGL context. Live GPU rendering, 3D raycasting/motion, physical touch and Safari/device performance remain unverified. Desktop and narrow interactive poster rendering, the five semantic selections, closing/focus behaviour and public asset delivery were subsequently tested, as recorded below. No screenshots of the four GPU transformation stages are claimed.

The following checklist remains a reference for further device coverage; completed public-browser checks are recorded in the final section:

1. Open the private review as owner or serve this branch on a normal development machine. Check 1440×900, 768×1024, 390×844, 375×667, 320×568 and landscape, with no horizontal overflow or overlapping panel/node controls.
2. Select all five points using mouse/touch and keyboard buttons; confirm each explanation and matching 3D response. Click the actual M and selector geometry. Dragging must rotate without accidentally opening a panel. Close with its button/Escape; confirm focus returns visibly.
3. Choose a work-directory button below the scene; confirm explanation is brought into view and still works when WebGL/model loading fails. Check learning/contact links and the Design process action.
4. Test native forward/reverse scroll through Idea, Design, Build and Reality, exploded/structure modes, bounded zoom, reset and pause/resume. Capture the opening, each stage and each selected capability on desktop/mobile.
5. Test reduced motion, JavaScript disabled, forced WebGL failure (`/?engine=fallback`), missing module and context loss. Essential content and contact must remain available.
6. Inspect console and network. Profile `window.creationEngineDiagnostics()` on capable/constrained devices and confirm hidden/off-screen suspension. A 60 FPS target is not yet measured or guaranteed.
7. Smoke-test existing project routes and re-run the protected-file check before merging through the existing production process.

## Payload

The primary model has 46,232 triangles, 32 mesh primitives, five materials, seven mechanical roots and five capability IDs. Its GLB is approximately 1.18 MB; the initial WebP poster is approximately 108 KB. Both are smaller than the previous model/poster. There are no model textures, runtime CDN requests, external telemetry or paid runtime services.

Three.js r170 remains locally vendored. LinkeDOM is a pinned **development-only** dependency for reproducible DOM checks; it is never loaded by the homepage. Editable Blender/source files and the archived first engine are not requested during normal page loading.

## Production preflight — 26 November 2026

The user authorized review, concrete Blender improvements and publication to the existing website. The MO identity was retained. Blender corrections give the M consistently outward-facing closed surfaces and a true graphite inset with an even titanium border. The GLB remains 1,181,008 bytes; 32 meshes / 46,232 triangles / seven roots / five capabilities are preserved. Exported-geometry tests verify consistent shared-edge winding and positive enclosed volumes. The cleaner 128-sample fallback render was inspected.

Gesture handling now tracks primary pointer ID and maximum travel: dragging out and back cannot accidentally select a part, and a second touch cannot rotate or release the primary gesture. The geometry and touch regression checks passed before the first release; the current complete suite counts are recorded above.

Repository Pages settings were verified through the live API: legacy branch publication from main at /, with CNAME www.elasrag.com. Before rollout the previous homepage was still built at 88277c7; /adam/, /wf/ and /LakelandRush/ returned200. The old homepage backup is exact. No deployment workflow, API or unrelated route is changed.

A separate Cloudflare check, Workers Builds: wf-backend, failed on the development branch; it is not a homepage Pages build and its cause is unverified. WF files are unchanged. The mo.elasrag.com endpoint returned403 before this release, while the static /wf/ route returned200. Neither is being represented as a successful WF production check.

The private browser preview remains signed out and the managed preview relay has no supported working port override. After the available preflight checks, the authorized Pages release was checked on the public homepage. The discovered poster interaction, release-cache coherence and compact-spacing issues were addressed. Actual results are recorded below. No unperformed Safari/physical-device test is claimed.

## Actual public browser review — 26 November 2026

The new homepage was opened on the public domain in managed Chromium. This environment disables WebGL (GL_VENDOR Disabled / context creation rejected); the fallback was observed instead of being described as a successful GPU render. That real failure exposed two useful improvements: preserve all five selectors on the poster, and use content-hashed production JS/CSS to avoid old cached source modules mixing with a new release. Both improvements were deployed and the public page was reloaded successfully.

Verified through actual browser interactions:

- All five labelled selectors at measured CSS viewports400×624 and1168×735 disclose their distinct expected title and action. No horizontal document overflow was observed.
- Escape closes a panel and returns focus to its original selector. A work-directory choice brings its explanation into view; the close button returns focus to the directory.
- At333×520, the technology selection is readable, all five target centres are reachable according to elementFromPoint, and no horizontal overflow is present. The observed tight text/object gap was addressed by moving the compact object lower. This is a resized/zoomed desktop Chromium viewport, not a physical phone or Safari emulation; DevTools/device emulation are restricted by the browser environment.
- The initial homepage and five selected states were captured at desktop and narrow widths. See docs/screenshots/. These images show the interactive poster fallback, not a live WebGL render or the four GPU transformation stages.
- Public HTTP checks confirm200 responses with expected MIME types and matching SHA256 contents for the homepage, production JS/CSS/license, model and poster. Existing /adam/, /wf/ and /LakelandRush/ routes remain200. Evidence is retained in the shared release-http.json artifact.

Still not performed: live GPU/Three.js rendering, 3D raycast/rotation/zoom/exploded/wireframe interaction, physical touch/pinch, the four GPU-stage screenshots, real device frame rates, actual Safari/iPhone/iPad testing, OS reduced-motion emulation and JavaScript-disabled browser testing. These remain explicit compatibility limits; the ordinary content, real fallback disclosure and existing route checks above were performed.
