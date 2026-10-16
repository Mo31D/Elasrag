# Verification report — 15 October 2026

## Adaptive expansion — 15 October 2026

- `npm test`: 44/44 passing, including backend/RLS, generation limits, full learner journey, daily word trail, asset registry and the complete science lab journey.
- `npm run build`: TypeScript check, Vite production bundle and `/adam/` staging completed successfully.
- Generated output uses the `/adam/` base path and includes the separate static `/adam/science/` and `/adam/words/` experiences.
- No paid service, automatic audio generation, microphone recording, Reward Credits or device-control integration was enabled.
- Device speech remains dependent on the voices installed by the browser or operating system. Approved provider clips are played only when present in the reviewed manifest.

## Deep learning polish — 16 October 2026

- Strict TypeScript, Vite `/adam/` production build and staging passed.
- All 41 automated tests pass. The full simulated learner journey now covers six confidence-first maths paths, hints, a stretch question, XP deduplication, profile switching, persistence and the Word Kingdom interactions.
- The maths start was rebuilt around Year 3–5 foundation review for a Year 6 learner: place value, grouping/division, fractions of amounts, percentages, metric conversion and triangle angles. Ratio and formal algebra are explicitly deferred rather than used as surprise assessment questions.
- Word Kingdom contains 621 unique cards: both complete KS2 statutory spelling lists remain intact and 32 supplementary, teacher-reviewed school-language cards are separated from statutory labels and optional enrichment.
- The empty generated-audio bucket was identified as the cause of the broken word playback. The child interface now uses the best available `en-GB` device voice immediately, preserves pitch when slowed and makes no failed cloud request. No Google clip is represented as approved.
- Approved cloud lesson summaries are cached locally without student records, answers or other sensitive data, so a temporary session/network restore failure no longer removes their atlas cards. Sign-out clears this index.
- The local preview server started, but the remote browser runner cannot reach container localhost (`ERR_CONNECTION_REFUSED`). Real Samsung/iPad visual and speech playback checks therefore remain required after GitHub Pages deployment.

## Passed automated checks

- TypeScript strict no-emit check and Vite static production build with `/adam/` base path.
- Eleven tests (including five foundation tests added below): lesson-package schema; complete simulated-DOM detective/maths journey; XP deduplication; independent-day mastery and due reviews; supported-practice separation; invalid progress recovery and persistence round-trip.
- Simulated journey checks: progression blocked without evidence, wrong-answer feedback, optional read route, clue notebook, correct sentence, all four vocabulary questions, completion, reopening without repeat XP, reinitialisation from saved progress, all three maths engines, extension interaction, and parent desk.
- npm audit: no known vulnerabilities at verification time.
- Original WAV measured with ffprobe: 160.400 seconds. MP3 generated from this exact file and measured at 160.464 seconds (encoding padding). No replacement voice.
- Static output paths and repository scope verified separately before packaging.

## Important verification limit

These are **not real-browser end-to-end tests**. The environment's browser security policy rejected the local preview navigation, and browser QA could not be completed. The local preview supervisor started successfully; that does not verify rendering or audio playback. No passing iPad, Safari, touch, visual-layout, screen-reader or full-screen test is claimed. Scene artwork was inspected only as source assets; the rendered UI was not visually approved.

Original HTML cue times are provisional. Audio chapter seeking and word snippets are implemented but need real playback and listening verification. Scene summaries are available as text, not full verbatim captions. Speaking prompts wait indefinitely. The fixed starter recall questions and rule-based hints are not a full adaptive assessment bank.

## Acceptance criteria

| # | Criterion | Status |
| --- | --- | --- |
| 1 | Actual browser game | Implemented and built; real-browser confirmation pending |
| 2 | Immersive environment | Illustrated map and scenes implemented; visual QA pending |
| 3 | Playable Episode 1 | Simulated interaction journey passed |
| 4 | Uploaded narration | Bundled and decoded as MP3; real playback pending |
| 5 | Story vocabulary | Cue handling and story interactions implemented; timing QA pending |
| 6 | Word replay | Original excerpts implemented; listening QA pending |
| 7 | Interactive clues | Passed simulated journey |
| 8 | Complete-sentence activity | Passed simulated journey |
| 9 | Sufficient thinking time | No response timers; explicit continuation required |
| 10 | Learning gates progression | Passed simulated journey |
| 11 | Consistent XP | Deduplication and journey checks passed |
| 12 | Refresh persistence | Storage round-trip and application reinitialisation passed in simulated DOM |
| 13 | Maths Quest | All three engines passed simulated journey |
| 14 | iPad touch | Responsive CSS/native buttons implemented; device QA pending |
| 15 | `/adam/` build | Passed |
| 16 | Honest capability labels | Local editor, credits, roadmap and assessment limits documented |
| 17 | Root site unaffected | Change scope restricted to `adam/` |
| 18 | Expansion structure | Typed content, separate progress/audio/style/assets; general episode authoring remains limited |

## Manual release checklist

1. Serve the repository, open `/adam/` in desktop Chrome and iPad Safari, check landscape and portrait and keyboard-only operation.
2. Play every chapter and vocabulary excerpt with headphones; check the original narrator and calibrate start/end times in `content.ts` against the actual recording.
3. Finish the investigation using both sound and read routes; test all wrong answers and hints. Confirm questions wait and do not reveal their answer automatically.
4. Inspect visual contrast, scene cropping, small-screen scrolling, focus trapping, Escape, reduced-motion, and iOS full-screen fallback.
5. Refresh mid-case and after completion; reopen for no repeat XP. Test storage denial and clearing browser data.
6. Complete all engines and their extensions, reset fraction pieces, test local audio import and lesson import preview with valid and malformed JSON, and verify exported private progress.
7. The owner has authorised automatic publication of tested milestones. Record the remaining manual verification honestly after publication; check `/adam/` and preserve the existing root site.

## Later phases

Detailed productive vocabulary evidence, varied recall contexts, full transcript captions, confirmed cue alignment, a general multi-scene lesson editor, curriculum sequencing for the 159 planning entries, learner switching, authenticated cloud sync, and a separately approved rewards integration. No ambient music or audio-reactive character lip-sync is included in this first slice.


## Continuation milestone

Additional automated tests cover independent family profiles, bounded events with sensitive payload exclusion, prerequisite planning and approved-content reuse, reserved-budget safeguards and default-off generation, arithmetic quarantine and educational approval gates. The simulated journey additionally creates Joseph in Year 4, checks a different fraction puzzle, grouping and sequence engines, confirms the original-audio notice and switches back to Adam with his progress intact. Actual cloud connectivity, RLS, authenticated parent access, cloud TTS, semantic AI validation, scheduled replenishment and automated reports are not implemented or claimed. New profile adaptation currently uses a supported starting stage plus hints/extensions; it is not a diagnostic placement assessment.

## Publication verification

Milestone merged through PR #20. GitHub Pages run 38722037804 completed successfully. The live `/adam/` HTML references the new bundle, and the published JavaScript matches the tested build byte-for-byte. This HTTP verification does not establish real-browser rendering or correct audio cue alignment.

## Cloud preparation verification (15 October 2026)

- PostgreSQL-compatible PGlite tests execute the actual migration, with simulated Supabase Auth/Storage schemas and real database roles/RLS. They verify family isolation, anonymous denial, blocked direct XP/RPC writes, atomic reservation deduplication, cooldown/daily caps, required review, idempotent attempts and XP caps.
- Mock HTTP adapter tests cover missing/invalid authentication, unenrolled users, missing Gemini secrets, free-tier confirmation gates, structured generation saved as pending review, answer mismatch quarantine and error redaction. The synthetic English fixture is **not** a real Gemini output.
- Simulated DOM tests cover the new data-driven template and verified public-project configuration; skill routing tests prefer due reviews then new words rather than repeating practice not yet due.
- The Edge Function entrypoint passes Deno type checking using the installed pinned npm dependency; frontend strict TypeScript and static build pass. No remote Supabase function execution or actual provider request is claimed.
- The Adam project was verified as Free plan, Frankfurt, healthy and initially empty. Three migrations, 15 RLS-protected app tables, a private bucket and `learning-api` were deployed. The security advisor reports no findings; foreign-key index findings were corrected.
- The server-side Gemini secret was exercised without exposing it. `gemini-flash-lite-latest` returned a real sample, **The Mystery Pen**, which passed JSON Schema and canonical semantic checks (187 prompt tokens and 160 output tokens). It still requires adult review and is not attached to a family record.
- The production function was restored after each one-time provider test and rejects an anonymous status request with HTTP 401. Authenticated parent invocation, real progress sync, Storage uploads and device/browser QA remain pending because no parent Auth identity has been created. No project outside Adam was changed.

## Hands-on visual tools — 16 October 2026

Built on updated main `076b4d1`, preserving the owner's responsive Atlas,
shared learning rewards, profile-specific science state and automated builds.

- Added optional fraction/percentage lantern pieces inside fraction missions.
- Added adjustable rectangle tiles with distinct perimeter and area calculations.
- Added a touch/keyboard coordinate treasure grid with ordered-pair feedback.
- Added a qualitative sugar/sand particle view in Discovery Laboratory.
- Opening or manipulating a maths model marks the response as supported practice.
  Exploration does not award XP or count as independent mastery.
- Particle numbers are conserved; the model explicitly labels scale and colours
  as symbolic and does not imply sand becomes soluble through stirring.
- 54 automated tests passed; strict TypeScript and `/adam/` production build passed.
