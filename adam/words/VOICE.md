# Word Kingdom Audio Studio — Reviewed Gemini Voice Library

Path: `/adam/words/studio/` (separate parent-only facility; not in child gameplay).
Server: Supabase Edge Function `word-voice`, guarded by `verify_jwt: true`.

## Data and privacy

- `ala_word_lexicon` lists only the fixed, editorial Word Kingdom corpus.
- `ala_word_voice_jobs` records a server-controlled, unique pair of word ID and audio variant (`word` or `sentence`), requester, status and timestamps.
- Only a verified **enrolled parent** with free-tier confirmation can request generation. Secret Google key never reaches the browser.
- A generated recording is **private and pending**. A parent listens via signed 2-minute playback URL and explicitly approves. On approval, the server copies the WAV to the public, read-only `ala-word-audio` bucket.
- Approved static files are publicly playable at `/storage/v1/object/public/ala-word-audio/en-GB/{wordId}/{variant}.wav`. They contain only predefined dictionary words/educational phrases, no identifying child data.
- The Word Kingdom learner page checks for approved voice clips before playback; otherwise it explains the clip has not yet been published and offers an **explicitly labelled device-voice alternative**. It does not pretend that browser speech is Google speech.
- Google model: `gemini-3.8-flash-tts`, voice `Kore`, natural British English style. Audio clips are cached once. Two repeats are done by the player; no repeated provider charges.
- Hard daily cap of 8 newly generated clips per parent, cooldown 10 seconds, no automatic retries on failure, no background runs. No paid fallback. This cap limits our usage, but Google's own free quota and account billing controls must also be checked.

## Known limitations

- **No Google audio has been generated, listened to or approved in this commit.** The voice source will remain unavailable until the authorised parent uses the new studio and approves clips.
- An adult sign-in is required **in the separate audio studio**, not on the student home page. Work can later integrate this into the existing authenticated Parent Desk rather than duplicating logins.
- The studio is a controlled pilot; it is not yet a scheduled all-words production pipeline.
- A parent must listen through to the end before the Approve button becomes available. The service can't automatically certify accent or pronunciation.
- A failed/blocked attempt does not automatically retry; call the administrator before allowing new generation.
- Not all image categories have dedicated realistic illustrations. The existing SVG is an affordable placeholder, with approved-image enhancement remaining separate.
- Learner progress is still device-local; cross-device Supabase synchronisation remains Work integration.
- Editorial Year 0–6 introduction bands are **not a comprehensive statutory word list**; see official English National Curriculum and Appendix 1, and expand with provenance.

## Deployment steps for Work

1. Review migration `adam/game/backend/supabase/migrations/20261015163000_word_kingdom_voice.sql`.
2. Apply migration to existing Supabase Adam (only after checking concurrent Work migrations). Do not change `learning-api`.
3. Deploy `adam/game/backend/supabase/functions/word-voice` with `verify_jwt=true` and model secret `GEMINI_API_KEY` already stored server-side. Require `GEMINI_FREE_TIER_CONFIRMED=true` and parent `free_tier_confirmed=true`, `paid_usage_allowed=false`.
4. Test `status`, generate a **single** clip, listen in Parent Studio, then approve. Check public playback in Samsung Chrome and iPad Safari. Verify that no unapproved clip becomes public.
5. Review GitHub Actions and mobile responsive layout. Preserve Word Kingdom's existing local progress keys and all primary game functionality.
6. Only then begin generating words in manageable reviewed batches and expand curriculum via a separate audited process.

API reference: https://ai.google.dev/gemini-api/docs/speech-generation
