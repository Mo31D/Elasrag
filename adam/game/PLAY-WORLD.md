# Play World — visual learning release

The existing game, lesson data, original narration, learner identities, notebook,
mastery evidence, XP ledger and Supabase permissions remain the source of truth.
This release changes their presentation and adds visual ways to interact.

## Artwork and prompts

Four original assets were generated with ChatGPT's **built-in Imagegen tool**,
then exported to WebP. No external image service, project API key or paid cloud
infrastructure was enabled. These are fictional characters, not child photographs.

Source assets live in `adam/game/public/assets/play/`; `npm run build` stages
them into `adam/assets/play/`. The versioned registry is
`adam/game/public/shared/play-art.js` (staged into `adam/shared/play-art.js`).

Production prompt specifications used for this illustration set:

* **world-map-v1.webp** — Original premium storybook adventure-game world map,
  portrait 2:3. Four floating islands linked by glowing paths: British school
  upper left, magical tree library upper right, crystal number kingdom lower
  left, science observatory lower right. A small explorer boat in the centre.
  Warm painterly 3D depth, navy/teal scenery, golden light, memorable readable
  silhouettes. No lettering, logos, UI, watermarks or copyrighted characters.
* **school-clues-v1.webp** — Landscape 3:2 British school mystery scene in the
  same original storybook style. Trophy cabinet left, conspicuous empty round
  red velvet stand around 38% across and 57% down, golden glitter trail below,
  blue polishing cloth on a bench at the right. Maya and Leo, approximately
  10–11, in school uniform at the right. Warm light and clear clue placement.
  No text, labels or UI.
* **word-stories-v1.webp** — Portrait 2:3 sheet of six equally sized square
  narrative illustrations in exactly two columns and three rows. Reading order:
  a boy notices a feather at a trophy case; a girl puzzled by a missing jigsaw
  piece; two detectives investigate footprints using a magnifying glass; a boy
  relieved to hug his found dog; a girl curious about a beetle on a leaf; a boy
  confidently presents his model bridge. Original cohesive painterly school-age
  characters, clear expressions and context. No text or dividers.
* **trophy-safe-v1.webp** — Landscape 3:2 warm storybook art-room reveal.
  Kind Mr Clark, green jumper and work apron, polishes the safe golden trophy
  on the left, trophy around 40% across and 55% down. Maya and Leo stand
  relieved at the right. Match the school scene's characters and lighting.
  No lettering, UI or logos.

The six vocabulary scenes are **context cues**, not scored picture-identification
answers for abstract words. Other words retain their existing vector fallback.
They are not presented as hundreds of newly illustrated premium assets.
Mathematical and scientific models remain deterministic HTML/SVG, not generated
images. Narration has not been regenerated or changed.

To replace art, add a new versioned file, update the registry, and review composition/hotspot coordinates before building.
The word sheet must keep the exact 2×3 panel order. Keep descriptions accurate.

## Interactions and rewards

* Island destinations open the existing missions and collections.
* Captions are optional; the original story can pause, continue or replay.
* Value crates select an answer; checking is a separate deliberate action.
* Fraction-of-an-amount practice uses four groups of five lanterns. Percentage
  comparison stays in its own activity. Garden, coordinates and particle tools
  are visible when useful.
* The explorer kit reflects existing completion records. Opening a tool or
  picture does not create XP or mastery. Victory feedback follows actual awards.
* XP, Word Stars, educational mastery and disabled Reward Credits remain separate.
  No phone-time conversion or device restriction has been activated.

## Verification

Run `npm ci --prefix adam/game`, `npm test --prefix adam/game` and
`npm run build --prefix adam/game`. CI's browser check exercises five Chromium
viewport/touch configurations, real routes, retries, notebook persistence,
visual models, reward deduplication, image failures and mobile layout geometry.
Screenshots are retained as a workflow artifact for visual review.
These are emulated viewports, not physical Samsung/iPad Safari certification.
