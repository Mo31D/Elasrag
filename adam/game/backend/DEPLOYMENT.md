# Adam cloud integration — activation checklist

This source is prepared and locally tested. It has **not** been applied or deployed to a live Supabase project. The connected plugin returned `{"projects":[]}` during this task, so Adam's project reference, Frankfurt region, Free plan and settings could not be independently verified. No other project was changed.

## Unblock access

In ChatGPT Settings → Apps → Supabase, reconnect the Supabase account that owns the Adam organisation. If the OAuth authorisation asks which organisations to expose, include Adam. Verify that Adam is visible in the Supabase dashboard under the same account. Recheck access through `list_projects`; do not create another organisation/project or use Dating as a substitute.

## Secure configuration

Once access is verified, use Supabase Dashboard → **Adam** → **Edge Functions → Secrets** to save the existing Google AI Studio key with this exact name:

`GEMINI_API_KEY`

Never put its value in a conversation, browser game field, Git, URL, `.env` committed to Git, application log, or frontend configuration. No replacement key is needed. Supabase supplies its own server and publishable keys to the function environment.

The server also requires `GEMINI_FREE_TIER_CONFIRMED=true` **only after the owner has verified that this key's Google project is on the Free tier with paid billing disabled**. The API request has no reliable "free-only" billing switch, and this app cannot inspect Google's billing state. If the Google project is billed, do not enable generation without separately approving costs. A model having a free tier does not prove this particular key is free. No paid fallback is implemented.

## Apply and deploy, through Work

1. Verify the Adam project ID, organisation, region and plan; inspect any existing schema and Auth configuration before writing.
2. Apply `supabase/migrations/20261015110315_adam_secure_learning_foundation.sql` to Adam only using the connected migration tool. It creates app-prefixed tables/RLS, service-only procedures, a private educational-asset bucket, and four supplementary vocabulary objectives. It seeds no children or parent identities.
3. Run live database checks and Supabase security/performance advisors. The existing local tests are not a substitute for those checks.
4. Create a parent in **Authentication → Users** using the Supabase secure interface. The owner chooses the login credentials outside chat. Enrol that verified Auth user ID in `ala_parents` using the administrator connection. Public sign-up is not implemented. A valid Supabase login alone does not confer parent access.
5. Deploy `supabase/functions/learning-api` with `verify_jwt=true`, including `index.ts`, `handler.js`, `lesson.js`, `lesson-schema.json` and `deno.json`. Do not disable the platform JWT check. Its handler independently validates the user with Supabase Auth and requires an active `ala_parents` row.
6. Add the existing Gemini secret securely; verify its presence via the authenticated status action, which returns only a boolean. Confirm Free-tier usage before setting the server confirmation flag.
7. Once verified, put only the observed project URL and **publishable** key in `src/cloud-config.json` and set `enabled=true`. Never put a service-role, secret or Gemini key there. Build/test before publishing the updated frontend.
8. Sign in through Parent desk → Secure family learning, create a private cloud student, choose a daily limit (default 2, maximum 5), and deliberately enable free-tier text generation. Local records are not uploaded automatically.
9. Generate one real lesson, inspect its content and token usage, and leave it `pending_review`. Check its answer, meaning, sentence, natural British English, curriculum fit and child safety before approving. Only approved content can run in the reusable mission template.
10. Test a real student attempt and review schedule, retry the same attempt ID for zero duplicate XP, and verify cross-parent and anonymous denials against the live project. Then confirm the deployed game on iPad/Android/desktop.

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

Cloud writes, provider requests and actual remote deployment are blocked by missing project access. No real Gemini lesson or real learner record has been generated by this task. Automatic schedules, replenishment, paid usage, TTS generation, audio playback for generated lessons, Reward Credits and device control remain off. The existing Episode 1 narrator is unchanged.

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
