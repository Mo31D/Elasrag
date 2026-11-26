# Repository and deployment audit

Inspected 25 November 2026 before implementation. Original production source: `88277c7b170d41c164e7338659bf018d4653917a` (`main`). Development branch: `feat/creation-engine`.

## Existing architecture

The repository combines independently maintained static sites and applications. Its root `index.html` was a self-contained, 9,051-byte personal landing page, with inline CSS and a canvas 2D projected sphere. The sphere did not use WebGL or a 3D asset pipeline. The root page has no dependency on the root Node server.

`CNAME` contains `www.elasrag.com`. Public HTTP observations at approximately 19:05 UTC on 25 November 2026 established:

- `https://elasrag.com/` responds 301 to `https://www.elasrag.com/`.
- The `www` homepage responds 200, `content-type: text/html; charset=utf-8`, `content-length: 9051`.
- Responses include `x-github-request-id`, `x-github-edge-region`, and Fastly cache headers, consistent with GitHub Pages.
- Public response cache lifetime is 600 seconds. A deployment can remain cached briefly.

These observations, the CNAME, and existing workflow commands establish GitHub Pages as the root site's current delivery architecture. Account-side Pages branch settings were not readable through the available repository tool; no setting has been assumed changed.

The root `package.json` describes an older Express assistant app. `npm start` runs `server.js`, serves **`mo/`**, and provides `/api/ask` using an environment-provided OpenAI key. It is not an appropriate homepage preview server and is left untouched. No paid APIs, account credentials, backend, build pipeline, or hosting subscription are required by the new experience.

## Protected applications and routes

All pre-existing paths are retained byte for byte, except the authorized root `index.html`. The original inventory has 836 tracked files; 835 are protected. This includes:

| Path | Existing purpose/evidence |
| --- | --- |
| `/adam/` | Adam learning game and compiled assets |
| `/adam/science/` | Science page |
| `/adam/words/`, `/adam/words/studio/` | Word learning experience and authoring page |
| `/adam/cell-transport-lab/` | Independent app with its own package |
| `/LakelandRush/` | Game, source, build files, world regions and GLBs |
| `/IWA/` | Independent learning application and build package |
| `/bmhair/`, `/bmhair/lv/`, `/bmhair/ru/` | Independent multilingual pages |
| `/cv/`, `/eid/`, `/game/`, `/local/`, `/s/`, `/site-pro/` | Existing static sites |
| `/engine/` | Existing engine project, unrelated to the new `/creation-engine/` |
| `/mo/`, `/mo/thinking/` | Assistant/frontend and multilingual thinking pages |
| `/wf/`, `/wf-backend/` | Companion frontend and Cloudflare Worker/API |
| `/English/`, `/archive/` | Existing materials and historical homepage |
| Root language HTML, games, JS, CSS, image and audio files | Legacy direct links and dependent assets |

The new directory name deliberately avoids the existing `/engine/` project. The homepage does not install a service worker, capture routes, rewrite URLs, or intercept links into these applications.

## Existing deployment workflows

All files in `.github/workflows/` remain untouched:

- `adam-site-build.yml` builds and commits only Adam outputs when Adam source changes on `main`.
- `adam-atlas-layout.yml` and `adam-word-kingdom.yml` validate Adam-specific changes.
- `lakeland-rush-pages.yml` builds/stages only Lakeland Rush outputs and requests a GitHub Pages rebuild on related `main` changes.
- `wf-validation.yml` runs independent WF checks, bundles its Cloudflare Worker, and probes `mo.elasrag.com`.

`wf-backend/wrangler.jsonc` declares the `wf-backend` Worker, KV, a Durable Object, and `../wf` static assets. It is separate from the root GitHub Pages homepage. No changes are made to those bindings, compatibility date, routes, API implementation, or frontend.

## Scope verification and recovery

Run from the repository root:

```sh
node creation-engine/tools/check-scope.mjs
```

The script compares Git blob hashes against the original base for **every** protected file, detects deleted protected files and new files outside the authorized scope, and verifies the homepage backup's exact original hash. The allowed change surface is only `index.html` and `creation-engine/**`. It does not rely on a manually selected list of routes.

Before any merge, run the scope check again and inspect `git diff --stat 88277c7b170d41c164e7338659bf018d4653917a`. This is source-integrity evidence; it does not claim every unrelated application's live behavior has been tested.

An exact backup of the previous homepage is retained as `creation-engine/docs/homepage-before.html`. To restore it in a recovery branch:

```sh
cp creation-engine/docs/homepage-before.html index.html
```

Commit and deploy the recovery through the existing repository process. Existing project files need no restoration because they were not modified.

## Release boundary

The development branch is reviewable independently of production. Previewing the development checkout does not deploy `main`. The final change should be merged only after review of the supplied preview, captures and test report. The existing CNAME, workflows, server and hosting architecture are preserved; the new homepage remains a buildless static page with local JavaScript modules and local 3D assets.
