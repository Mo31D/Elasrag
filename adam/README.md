# Adam Learning Adventures — first playable adventure

A local-first illustrated detective adventure and three mathematical puzzle engines, built in TypeScript with Vite. The root Elasrag site is untouched. This release changes only `/adam/`. Automatic publication of tested milestones is authorised by the project owner.

## Play and develop

Requires Node 22.12+ (or Node 24) and npm. From the repository:

```sh
cd adam/game
npm ci
npm run dev
```

Open the printed local URL followed by `/adam/` (normally `http://localhost:4173/adam/`). Tap **Begin investigation**. Hear each chapter or choose **Read instead**, examine the clues, build a report, and complete the vocabulary recall. Select any of the three engines on the atlas for maths.

```sh
npm test
npm run build
```

Build validates TypeScript and stages the production files at `adam/index.html`, `adam/assets/`, `adam/audio/`, and `adam/data/`. The build source remains in `adam/game/`. Vite builds into an isolated ignored `dist/`, then `stage.mjs` copies only app output into `/adam/`. Commit the source, lockfile and staged output together. GitHub Pages can serve those staged static files directly; no Node server or backend is needed in production.

To test the actual static build locally, serve the repository with a static HTTP server and visit `/adam/`. Do not expect the multi-file module build to work by double-clicking `index.html`.

## What is implemented

- Illustrated floating-island atlas and original vector environments; source school characters and scenes adapted from the supplied Episode 1 HTML, without an iframe.
- Six-stage interactive investigation: cabinet observation, optional explanation, glitter and cloth collection, evidence-based destination, safe trophy reveal, complete sentence construction and contextual recall.
- Original narration converted from the supplied WAV to a 96 kbps MP3 (same voice, 160.4 seconds in the WAV); scene chapters pause for learner decisions. Word replays use original-story excerpts, with optional 0.9× playback. The snippets include surrounding speech rather than isolated dictionary pronunciations.
- Optional speaking prompts, keyboard and touch-sized native buttons, no speech capture, speech scores or speaking timers. Reduced motion, sound preference, full screen when supported, and flexible breaks.
- Year 6 fraction simplification, ratio sharing and inverse-operation algebra, pictorial support, hints, language explanations and extension puzzles. The fraction pieces can be toggled and reset.
- Local progress, one-time adventure XP awards, achievements, due-review routing and a separate disabled Reward Credits architecture.
- Parent desk: skill evidence, local audio import through IndexedDB, validated JSON lesson preview and save, private progress export, reset and configurable XP rules.
- A 159-entry planning roadmap extracted only from generic tracker fields. Learner records, notes and workbook data have NOT been committed. Roadmap entries are planning summaries, not statutory quotations, complete curriculum coverage or implemented lessons.

## Architecture

| Layer | Files |
| --- | --- |
| Scene and UI controller | `game/src/main.ts` |
| Curriculum and story content, validation | `game/src/content.ts` |
| XP, persistence, review evidence | `game/src/progress.js` |
| Original narration and IndexedDB media | `game/src/audio.ts` |
| Responsive game styling | `game/src/style.css` |
| Editable vector artwork, narration | `game/public/assets`, `game/public/audio` |
| Planning roadmap | `game/public/data/curriculum-roadmap.json` |
| Logic and simulated-DOM journey tests | `game/tests` |

For this first slice a DOM/SVG scene renderer was chosen over a canvas engine: it preserves the source vector characters, supports keyboard and touch without duplicate accessibility layers, and suits the existing static host. Rendering, educational content, media and progress are separate modules. For movement-heavy worlds, a future renderer can sit over the same content/progress contracts. `main.ts` is the first mission controller, not a complete general scene scripting engine.

## Educational evidence and limits

Mission XP defaults to 5, independent understanding to 3, and new application/review to 2. IDs prevent repeat XP for a completed mission or challenge. Parent XP changes affect future awards only. XP does not measure mastery. Rewards have no real-world value. Reward Credits and device-time enforcement are disabled.

Skills begin Not started, then Learning/Practising, become Review due when scheduled, and Secure after at least four independent days with three later due reviews. Initial review intervals are 1, 3, 7, 14 and 30 days after the current attempt. Supported attempts schedule a next-day review and do not count as independent. This is a provisional review heuristic, not a validated assessment model. Word choice tasks assess meaning in context; independent productive speech and writing are not assessed. A complete sentence can be assembled independently, but free writing is not automatically graded. The recall items are a small fixed starter set; varied assessment banks are future work.

Spoken answers are optional and never judged for fluency or repetitions. Any intervention for a stammer should be guided by an appropriately qualified speech and language therapist.

## Parent content workflow

1. Open Parent desk → Import a lesson and preview → Download lesson template.
2. Edit the JSON's subject, title, year (1–6), objective, vocabulary, question, choices, correct answer index and hint.
3. Import the JSON, inspect the preview, then Save locally and play.
4. A new imported quest appears on the atlas. It is a local text/vocabulary decision challenge, not a fully authored animated episode. It intentionally awards no mastery or Reward Credits. One local imported quest is supported in v1.
5. For a full second episode, add a content module and reviewed audio chapters under `game/src` and `game/public`, expand the mission controller, run checks, build, commit the generated output and open a PR. Source changes and online publication need Git; the client editor does not publish to GitHub.

Do not put tokens or private records into JSON. Imported text is validated and escaped before rendering.

## Privacy and profiles

Progress uses the versioned `ala-adventure-v1` localStorage key. A replacement original narration uses IndexedDB. Clearing browser data, private browsing, another device or a different origin may lose or separate progress. Export backups when needed; backup restoration is not implemented in v1. There is no cloud sync, login, secure parent gate, analytics, ads, microphone use or external chat. Anyone using the device can access the parent desk; local data is not encrypted. XP is not tamper-proof. No personal learning assessment or speech recording is in the repository. The bundled educational narrator is public if the PR is merged.

Progress is keyed by a generic internal profile ID. Local multi-profile switching and separate Year 4 maths are implemented. Diagnostic assessment and cloud accounts remain future work. No assumptions about another learner are imported.

## References

The official programmes of study inform the English composition and Year 6 maths links. Game vocabulary and practice activities are supplementary. The supplied workbook's curriculum rows are expressly planning summaries, not official standards.

- DfE English: https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study/national-curriculum-in-england-english-programmes-of-study
- DfE Mathematics: https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study
- DfE Primary subjects: https://www.gov.uk/national-curriculum/key-stage-1-and-2

See `TEST_REPORT.md` for verification limits. The first milestone has been published under the owner’s automatic-deployment instruction; real-browser/device and audio cue verification remain pending.


## Continuation milestone: profiles, tracking and content production foundation

The same app now offers local explorer creation/switching from Parent desk. Supported playable starting stages are Year 4 and Year 6, with British English and England's primary curriculum. Year 4 has different fraction, grouping/division and sequence engines; it does not receive Year 6 ratio and algebra tasks. The shared English mystery is foundational practice, not a claim that each learner has the same English needs. The wider Years 1–6 roadmap remains a planning map. First names/nicknames and profile progress never enter Git.

Each local profile keeps its own XP, awards, mission checkpoint, clues, maths completions, skill evidence, review schedule, disabled credit balance and bounded event history. Activity events record learning outcomes, not raw speech or free-text answers. Active-time estimates only count visible intervals under 30 seconds between learning actions; they deliberately undercount reading/thinking time and are not proof of attention. This is local family profile switching, not private multi-user authentication.

`game/src/factory.js` provides tested prerequisite selection, approved-content reuse, disabled-by-default budget checks, arithmetic consistency checks, quarantine and review-required approval contracts. It is a production-pipeline foundation, not a deployed AI factory. `game/backend/README.md` lists the authenticated hosted integration boundary, costs, secrets, audit and TTS strategy. No cloud records, schedules, AI requests, TTS generation or paid infrastructure have been activated. The original narrated name is unchanged for other profiles and is labelled clearly.

Automatic GitHub publication is now authorised by the project owner. Development milestones still need successful tests/builds and change-scope verification; unresolved browser verification is reported honestly.

## Cloud content-factory preparation (15 October 2026)

Cloud source now lives in `game/backend/supabase/`, with a CLI-generated migration, an authenticated `learning-api` Edge Function, strict lesson JSON Schema, canonical English answer validation, pending review/quarantine and transactional XP/review logic. The client uses a lazy-loaded official Supabase SDK and a reusable illustrated mission renderer. `game/backend/DEPLOYMENT.md` documents activation and secure secret entry.

The connected Supabase account currently exposes **no projects**, so no migration or function has been applied remotely and no Gemini key or real generated lesson has been used. `game/src/cloud-config.json` remains `enabled:false`; Parent desk → Secure family learning explains this state. Existing local play and its original narration remain available. No local child records are uploaded automatically. The source is ready for project verification and live integration tests; it is not an active cloud service.
