# Word Kingdom — learning dictionary & visual asset pipeline (starter release)

**Path:** /adam/words/  |  **Parent product:** Adam Learning Adventures /adam/

## What exists
- 621 word cards. This includes full coverage of both 100-entry statutory Years 3–4 and Years 5–6 spelling lists, plus 32 teacher-reviewed cross-curricular school-language cards. School language is supplementary and is never labelled as a statutory spelling list.
- The reliable audio route is the best British English speech voice installed by the browser/device, selected by accent and quality signals. It is immediate, cached by the operating system and makes no provider call. **No generated Google WAV recordings have been approved or published yet**, so the learner UI does not probe empty URLs or claim cloud audio exists. See [VOICE.md](VOICE.md).
- Standalone game: word cards with procedural SVG illustration hints (no image-model costs); definition, contextual example, syllable-like text chunks, meaning, untimed typed spelling and word-order sentence tasks. Picture recognition is assessed **only for words whose pictogram actually depicts the answer**, to avoid dishonest score signals.
- Three core assessment channels (meaning, spelling, sentence); an additional picture-recognition channel only where the illustration unambiguously depicts the target word, per-day independent evidence, review due dates (1,3,7,14,30 days), replay without unlimited star farming.
- The local explorer name and stage are read **read-only** from Adam's existing `ala-adventure-v1` browser profile record. This module writes only `ala-word-kingdom-v1`. Existing game XP, Supabase Auth and cloud XP **are not modified**.
- Twelve cards per page, mobile-responsive portrait and landscape, reduced-motion support, keyboard-accessible native controls.
- Private local JSON backup export. This v1 does **not** restore, cloud sync, verify learner identity, or enforce parent-only controls.
- Generates an **art-brief JSON export** for the words visible on the current page. Every brief includes meaning, sentence, stable Art Bible, `reviewRequired=true` and `paidGenerationEnabled=false`. No image generation API calls or paid service activation.

## Integration contract for Work
1. Keep the parent game under `/adam/`. Add an **explorable Word Kingdom island**/button on the atlas that links to `/adam/words/`. The child can return via existing Adventure Atlas links.
2. Do **not** copy this code inside the main `game/src/main.ts` monolith. A distinct route/microfrontend is intentional for isolation; progressively share profile settings via a tested parent-owned contract.
3. Main app local profile key: `ala-adventure-v1`. Word Kingdom local progress key: `ala-word-kingdom-v1`. They must not be overwritten or conflated.
4. For cross-device progress, migrate to an authenticated, parent-owned Supabase adapter with RLS, secure child ownership and idempotent attempt IDs, keeping isolated Word Stars from main game XP until a deliberate scoring design is approved.
5. Add a reviewed content import system with lesson/curriculum provenance, phonics quality audit and teacher/parent approval. The two KS2 100-entry statutory group lists are fully card-covered; the separate optional enrichment vocabulary remains editorial, not a government list. EYFS and Year 1–2 have no blanket official dictionary of every word a child must know.
6. Add a reusable **approved image registry** keyed by a semantic visual concept + Art Bible version + locale (not duplicated per learner). The current images are deterministic SVG fallback illustrations; categories may reuse generic icons rather than dedicated depictions. For external AI imagery: server-only provider keys, fixed safe prompt inputs, cost reservation, dedupe/cache, content safety validation, adult image review, immutable approved version and fallback; paid generation off by default.
7. Add narrator audio library (word, phrase, slow variant) cached per voice/locale/model/content hash. Don't expose Gemini key to browsers. Provide play controls and a non-audio fallback.
8. Preserve oral practice as optional and non-scored. Stammering, repeating and extended thinking time must never reduce XP.
9. Tests: npm --prefix adam/game test; test /adam/words/ in Samsung S21 portrait and landscape, iPad Safari and desktop. Manual real-device and voice playback tests are **not yet complete**.

## Curriculum integrity
Official source: https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study
See [CURRICULUM.md](CURRICULUM.md) for the data contract, DfE source, precise distinction between statutory lists, non-statutory word examples, and editorial EYFS/extra vocabulary. The 100-word lists are for shared Years 3–4 and Years 5–6 groups, **not separate single-year lists**. Curriculum-first is the default; enrichment is opt-in.

## Security / finance
No browser microphone permission, speech recording, ads, tracking, external image URLs, unreviewed HTML import, API key, backend writes, or provider calls are used. Word stars are motivational local indicators, **not** mastery certificates or redeemable rewards. No paid activity is performed.

## Known limitations
Images are vector storybook placeholders, **not** image-generated cinematic illustrations. Device voices vary: the selector prefers natural `en-GB` voices and clearly reports when a British voice is unavailable. A consistent reviewed narrator still requires real approved audio files. Some abstract terms need context-driven custom illustrations. The assessment channels do not test genuine free-form expressive speaking or writing. Word order checks use curated sentence tokens and exact order; multiple equally grammatical variants are not yet accepted. Cloud account and mobile device continuity awaits Work integration.
