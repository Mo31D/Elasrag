# Reliability audit — 16 October 2026

Scope: the existing Adam game, daily journey, vocabulary notebook, maths, original narration, family snapshots, dependencies and Supabase advisories. Only `adam/` files changed.

## Reproduced and fixed

- Independent maths questions could show the original question's hint/answer. Extension feedback now uses its own explanation; attempts reset when moving to the new question.
- Submitting a solved maths form could create more evidence events. Completed forms are disabled and handler replay is ignored; an empty answer records no failed attempt.
- Guided work on a later review day moved the due date before the independent question could count. Preserve the original due review until new independent evidence; use London calendar days across devices.
- Notebook rotation could ignore an overdue facet. Select the actual overdue meaning/spelling/sentence facet before introducing unassessed facets.
- Science completed before entering Today could be missed. Store completion time and recognise today's completion, including prior award-event compatibility. No additional XP is introduced.
- A malformed snapshot `run` could overwrite root fields; nested malformed records could break consumers. Validate supported structures before saving/restoring and assign only missionStep/clues/maths at the root.
- Restoring Joseph into a device with Adam's legacy science record could discard the older record. Migrate it before writing Joseph's entry. Rollback frees partial new writes before restoring old keys on quota failure.
- The last narrated segment could miss completion because the actual file ends just before the rounded cue. Handle `ended` as well as cue time, complete once, and cancel callbacks when leaving a scene.

## Checks

71 Node tests pass, including the simulated complete learner journey and targeted regressions. TypeScript and production `/adam/` build pass. Five-viewport Chromium CI includes wrong extension answers, corrected feedback, disabled solved forms and unchanged XP after assisted retries. Static HTML paths were checked for missing targets. `npm audit` (all dependencies) reports zero advisories at the time of this audit.

## Service limits and remaining verification

Supabase security advisors: the voice-job table deliberately has RLS with no client policy (server-only default deny). Leaked-password protection remains disabled on the Free project: Supabase documents that feature as Pro and above (https://supabase.com/docs/guides/auth/password-security). No paid upgrade or account/security-policy changes were made.

No new provider audio was generated or approved. Actual Samsung/iPad/Safari and parent-authenticated cross-device browser trials remain separate from Chromium viewport checks and isolated snapshot tests. This audit is not a guarantee that every possible defect has been eliminated.
