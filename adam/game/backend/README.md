# Current cloud implementation

Executable preparation now lives in `supabase/`, with an authenticated Edge Function, migration and local PostgreSQL/RLS tests. See [DEPLOYMENT.md](DEPLOYMENT.md) for the current access blocker, secure Gemini secret entry and activation sequence. No live Supabase deployment or real Gemini generation has occurred. The notes below describe the original architectural boundary.

# Hosted platform integration contract — disabled

No hosted backend, provider, generation job or paid service is activated in this release. The only connected Supabase project discovered during development was named Dating; it has not been changed or used for children's data.

## Next deployment boundary

Choose a dedicated family learning project and region, confirm the service plan and budget, then implement and test Supabase Auth, ownership policies and storage in that project. Keep the current client local until this is verified. A publishable client key is not authorization; every student/event query must be constrained by the authenticated parent's ownership and enforced through tested RLS. Do not grant a public anonymous role access to children, progress, event, reward or generation-cost records. Do not use user-editable metadata as an authorization source.

Suggested records: parent accounts; students owned by a parent; progress events with an idempotency key; skill evidence; reviewed lesson versions; generation jobs; usage reservations; provider cost ledger; parental reward rules and redemption requests. Content and progress need separate access policies. Parent sign-in must precede cloud student access. A student nickname is not a login secret.

## Generation worker

`src/factory.js` implements the tested pure planner and candidate gate. It respects curated prerequisites, prefers approved existing content, quarantines arithmetic mismatches and unsafe instruction/link content, and requires an educational review record for approval. Budget checks include pending reservations and default to disabled. This module does not call AI/TTS, publish to a database, or authenticate reviewers by itself; invoke it only inside a future authenticated worker that owns those responsibilities.

The hosted worker should select a curated objective → check the approved catalogue → atomically reserve generation budget → deduplicate a request by curriculum/skill/language/template/version → call the text provider with a strict schema → validate structure and deterministic answers → quarantine or request review → produce/cache TTS and reusable assets only for accepted candidates → publish an approved immutable version → release the reservation and reconcile actual cost. Rate limit per family and system-wide, retry transient provider failures with bounded backoff, and use an idempotency key so retries cannot duplicate publication or spend.

No worker may infer that automated structural checks establish English educational quality. Curriculum, language, answer and safeguarding review remain explicit gates. Unknown prerequisite sequences in the 159-row roadmap are excluded from generation planning.

## Audio strategy

The supplied Episode 1 audio is immutable lesson media addressed to Adam. Other profiles receive personalised text and a visible original-audio notice. No TTS claim is made. Future lessons should use generic narration plus separately cached optional short greetings. Cache keys should include text, locale (en-GB or explicitly supported ar-EG), provider, voice and model version. Keep interface, instruction, narration language and curriculum as independent profile fields. Egyptian Arabic is not currently supported or offered in the UI. Arabic literacy/curriculum localisation and RTL need separate reviewed content.

## Cost and operations

Until a parent sets a budget and a worker is deployed, generation remains off. Track text/audio request counts, generated characters or provider billing units, storage, egress, reserved spend and reconciled spend. Reject new jobs before exceeding caps; pause when usage is unknown, rather than claiming costs are zero. Never put Gemini/TTS/service-role keys into Vite public variables, lesson packages or Git. Secrets belong to hosted function environment storage. Scheduled replenishment and weekly reports remain disabled until infrastructure, consent and delivery settings exist.

No local AI model, dedicated home server or permanent personal computer is required by this proposed hosted architecture. The shipped static game already works without those services. Development commands are for Work/GitHub workflows, not a requirement for students.
