# Adam cloud integration — activation checklist

The foundation is deployed to the verified Supabase project **Adam** (`uyfaipjthpsofjqcucop`), Free plan, Frankfurt. The schema, RLS, private bucket and authenticated `learning-api` function are active. The public client configuration points only to this project. No other Supabase project was changed.

## Secure configuration

Once access is verified, use Supabase Dashboard → **Adam** → **Edge Functions → Secrets** to save the existing Google AI Studio key with this exact name:

`GEMINI_API_KEY`

Never put its value in a conversation, browser game field, Git, URL, `.env` committed to Git, application log, or frontend configuration. No replacement key is needed. Supabase supplies its own server and publishable keys to the function environment.

The server also requires `GEMINI_FREE_TIER_CONFIRMED=true` **only after the owner has verified that this key's Google project is on the Free tier with paid billing disabled**. The API request has no reliable "free-only" billing switch, and this app cannot inspect Google's billing state. No paid fallback is implemented. The key and `gemini-flash-lite-latest` connection have been checked from an Edge Function without exposing the key.

## Apply and deploy, through Work

1. Create a parent in **Authentication → Users** using the Supabase secure interface. The owner chooses the login credentials outside chat. Enrol that verified Auth user ID in `ala_parents` using the administrator connection. Public sign-up is not implemented.
2. After confirming that paid billing is disabled for the Google project, add `GEMINI_FREE_TIER_CONFIRMED=true` in Edge Function Secrets.
3. Sign in through Parent desk → Secure family learning, create Adam's private cloud profile, choose a daily limit (default 2, maximum 5), and deliberately enable generation. Local records are not uploaded automatically.
4. Generate a lesson, inspect its content and token usage, and leave it `pending_review` until the adult checks the answer, meaning, sentence, British English, curriculum fit and safety.
5. Test a student attempt and review schedule, retry the same attempt ID for zero duplicate XP, then confirm the deployed game on iPad/Android/desktop.

`supabase/config.toml` is a checked-in deployment configuration template, not proof that those settings exist on the remote project. Do not blindly push all CLI configuration to an existing project; reconcile Auth and hosting settings first. The frontend remains disabled until verification.

## What is implemented in source

- Enrolled-parent authentication, explicit ownership filters and RLS on all app tables. The browser has read-only database grants; writes are server-owned.
- Curricula, prerequisite map, four enabled feeling-word objectives, students, lessons, reviews, jobs/usage, skill evidence, attempts, events, XP ledger, disabled rewards and private media metadata/storage.
- Transactional generation reservations, one-minute cooldown and daily caps including failed/unknown requests; deduplication; no automatic provider retry or paid fallback.
- Gemini JSON generation, strict AJV schema plus canonical definition/answer checks and unsafe-content quarantine. Structural/answer checks do not establish educational quality; adult review remains mandatory.
- Atomic review/audit publication and server-verified activity scoring. An independent correct vocabulary activity earns 3 XP, sentence construction 2 XP, and completing both 5 XP, once per lesson/student. A mastery day requires both activities correct independently on that day, with separate later-day recall before Secure.
- Parent console source for login, profiles, limits, generation, review/rejection, approved play, progress, XP and job usage/failures. Sessions stay in memory; refreshing requires login again.
- Shared illustrated mission template with story, word model, model-free vocabulary recall and sentence construction. Pending/quarantined content cannot be played. New cloud progress is separate from the existing local profile store.

## Deliberately not enabled

No parent or child identity has been seeded. Automated schedules, replenishment, paid usage, TTS generation, audio playback for generated lessons, Reward Credits and device control remain off. The existing Episode 1 narrator is unchanged. A real Gemini sample passed schema and semantic validation during deployment verification, but it is not attached to a family until the owner creates the parent identity.

## Audio research and costs

Google currently documents Gemini 2.5 Flash-Lite text generation and Gemini 2.5 Flash Preview TTS free-tier availability. Account-specific models and rate limits must still be checked after secret configuration; no quotas or free entitlement are assumed. The current speech documentation supports British-English voice discovery, but actual pronunciation and future ar-EG support need listening/localisation validation.

Future approved audio should be cached by the hash of approved text + locale + provider/model + voice + version, stored under the parent's folder in the private bucket, and served only to authorised families or via short-lived signed URLs. No duplicate audio should be generated for a cached hash. Do not send names, emails, private learning history or clinical information to the free-tier provider. Current prompts use only a curated word and a generic educational objective.

References checked 15 October 2026:

- https://supabase.com/docs/guides/functions/auth-headers
- https://supabase.com/docs/guides/functions/secrets
- https://supabase.com/docs/guides/storage/buckets/fundamentals
- https://ai.google.dev/gemini-api/docs/pricing
- https://ai.google.dev/gemini-api/docs/rate-limits
- https://ai.google.dev/gemini-api/docs/generate-content/structured-output
- https://ai.google.dev/gemini-api/docs/speech-generation
