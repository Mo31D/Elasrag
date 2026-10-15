# Episode 2 TTS pilot — independent backend
This is a **limited, secure pilot**, not a complete automated audio factory.

**Live Supabase Adam:** Edge Function `episode2-tts-preview` (JWT verification enabled).
**Model:** `gemini-3.8-flash-lite-tts` (Gemini free-tier supported; verify project billing and quota).
**Audio:** One hardcoded British-English two-speaker test line from *The Secret Library* (Narrator and Pip).
**Privacy:** Output lives in the existing private `ala-educational-assets` bucket at `family/<parent-id>/episode2/s01-preview.wav`. A parent receives a 120-second signed URL. No public listing. No child recordings.

## Authentication and usage
- Requires a signed-in, email-verified, enrolled parent JWT. No anonymous or publicly writable endpoint.
- Requires `GEMINI_API_KEY` and `GEMINI_FREE_TIER_CONFIRMED=true` in Supabase Function Secrets, and the parent setting `free_tier_confirmed=true`. Check Google project's actual free-tier billing status first; the function cannot verify invoices.
- No automated generation or scheduler. Only an explicit authenticated `generate-preview` request triggers the Google call.
- Database `ala_reserve_tts` serialises requests and prevents duplicate generation per parent/clip; 2/day maximum, 1-minute cooldown. This pilot exposes just one unique clip.
- Failed attempts remain accounted for. No retries or paid fallback.
- Production `learning-api` remains untouched; no effect on the current game or original Episode 1 audio.

## Request via an enrolled parent's browser session
`POST https://uyfaipjthpsofjqcucop.supabase.co/functions/v1/episode2-tts-preview`
with headers `Authorization: Bearer <parent access token>`, `apikey: <project publishable key>`, `Content-Type: application/json`.
Use JSON `{"action":"status"}`, then `{"action":"generate-preview"}`; retrieve existing audio using `{"action":"get-preview"}`. Do **not** transmit access tokens via chat or commit them.
Integrate these calls in a parent-only preview control using the **existing** Supabase session; do not create public API endpoints or expose service role keys.

## Verification
Deployment has been confirmed active by Supabase. The migration was applied. The actual Gemini TTS call and audio listening test still require an authenticated parent session; they **have not yet been performed**. Review pronunciation, voice consistency, and duration before approving a full episode.
The current branch is for preserving the implementation in source and for Work to integrate the parent preview UI and automated testing without merging blindly.

Sources:
- https://ai.google.dev/gemini-api/docs/speech-generation
- https://ai.google.dev/gemini-api/docs/pricing
- https://supabase.com/docs/guides/functions
