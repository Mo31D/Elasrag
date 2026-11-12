# Data architecture

All envelopes carry `schemaVersion: 1`. Stable word IDs identify learning units;
array position is never identity. `vocabulary.json` contains identities and source
attributes, `lessons.json` contains authored teaching content, `audio.json` contains
resource metadata, `sources.json` contains provenance and rights, and
`sessions.json` freezes target membership. Progress has a separate schema and is
never loaded from public content. No application persistence is implemented yet.

One headword groups lexemes (part of speech) and senses under one word ID.
Homographs retain separate lexeme/sense IDs and source-entry mappings, including
pronunciation variants when added to the lesson contract. Do not collapse lexical
identity merely because spelling matches; do not count each sense as another
session target. The prototype teaches one selected sense/POS per word, not every
possible dictionary sense. Future lesson schema migration will add per-lexeme
pronunciation variants; existing word IDs and histories remain stable.

Source membership is an array: each membership stores source ID, source entry ID,
collection, lexeme, CEFR, locator and rights status. Oxford 3000 membership and the
additional Oxford 5000 set must be distinguishable. Word-level CEFR is a display
summary, not a replacement for sense/POS-specific assignments. Null means unknown
or withheld; `cefrStatus` explains which. Never silently assign the easiest level
across multiple senses. Frequency matches attach to lemma/POS evidence; the first
prototype has no frequency matches. Additional frequency datasets can be added in
a versioned migration to an array of observations without changing word identity.

## Derived ordering

No alternate vocabulary copies. Future query functions sort IDs over the same
records, with stable word-ID tie breaking:

1. Personalised: use chosen language level and unknown/weak words, then independently
   observed comprehension, pronunciation and usage needs, practical context, and
   verified frequency when present. No phonetic level inferred from CEFR. Initial
   priorities are hypotheses until learner evidence exists. Store reasons for each
   recommendation. Do not use a blended mastery score.
2. Frequency: compare only compatible corpus measures; known values first, unknown
   in a clearly labelled group. Null never becomes frequency zero or lowest rank.
3. CEFR: A1 through C2; unknown/withheld separate. Filter the relevant lexeme first.
4. Alphabetical: English locale comparison, stable ID tie breaker.

Do not claim the hand-selected sessions are frequency-ranked or personalised from
observed performance. They are practical-context content drafts.

## Session and progress contracts

Exactly ten distinct word IDs per new session. The two prototypes share none.
Exercises, meanings and examples cannot enlarge that set. Reviews use a separate
queue and never replace a target. Once started, freeze the IDs and content version;
do not rerank an active session after source updates.

Future IndexedDB stores: sessions keyed by session ID; activity events keyed by
activity ID/event ID; word progress keyed by word ID; optional recordings keyed by
local blob key. Save activity result and resume cursor in one transaction. Resume
uses the same frozen word IDs, current word index (0–9) and activity ID, even after
days. A migration must preserve old content IDs or provide explicit mappings.

Each skill has its own state, due date, interval and evidence. An incorrect usage
answer affects usage review, not a known comprehension result. Self-comparison is
pronunciation evidence, not an objective accent score. Candidate initial review
intervals are 1, 3 and 7 days after successful retrieval, then longer; failures bring
only the affected dimension forward. These are adjustable design defaults, not a
validated personalised scheduler. No scheduling code is claimed in Phase 1.

Studied means required understanding/example/usage activities completed and
pronunciation attempted or explicitly deferred. Deferred listening/recording can
allow session completion but must not count as successful pronunciation retrieval.
Secure in one dimension requires later successful retrieval evidence; there is no
single mastered boolean. No time limit or automatic next session.

## Privacy and backups (future implementation)

Use IndexedDB for learning history and optional audio blobs; localStorage only for
small display settings. Request microphone permission at the time of recording;
allow denial, deletion and practice without recording. No cloud upload by default.
Browser-local data may be evicted and is not a guaranteed backup or encryption.

Export an explicit versioned JSON manifest conforming to the progress schema;
exclude recordings by default, with a separate opt-in archive if implemented.
Import must validate schema, IDs, timestamps, size limits and content version before
writing. Show conflicts; back up the current state, then apply atomically. Reject
unknown versions without deleting current data. Never import arbitrary executable
content. Schema format checks and cross-reference checks are required in the future
import implementation; the current validator validates public content only.

Do not commit exports, recordings, credentials, private annotations or learner
profiles. `private/` is ignored as defence in depth, not a substitute for checking
the staged diff. Future private sync requires authentication, consent and conflict
resolution; no Workers, D1 or R2 infrastructure is needed for this phase.
