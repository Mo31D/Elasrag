# Daily adventure and cross-device progress

The Atlas starts a small daily route: three collected-word recall activities, an appropriate unlocked maths path, and a completed discovery. London calendar dates keep the day consistent for the family. There are no streaks, timers, completion bonuses or penalties for stopping. Reopening a task does not award XP. Daily completion is independent of mastery.

## Maths

Place value has four stages: a worked example, a guided attempt, an independent new number and transfer to another column. Later calendar days alternate the independent examples. Guided retries do not penalise the later independent questions. Both independent questions must be solved without help for independent evidence. The next review follows the existing 1/3/7/14/30-day schedule.

Other maths paths retain their existing illustrations and visual tools, now explicitly classified as guided practice. Independent evidence and the independent XP award come from the separate application question. Previous worked models are hidden in that question to avoid showing the wrong numbers. The daily route chooses the first unlocked incomplete or due path; it does not require repeated basic work after successful progression. These other paths still have fewer question variants than the full place-value journey.

## Notebook

A three-word trail prioritises due vocabulary and rotates meaning, spelling and reconstruction of a known example sentence. The three facets keep separate evidence keys and dates; sentence reconstruction is not evidence of original composition. Hints and corrected answers are supported practice. Each word/facet can award one Adventure XP once, never an extra Word Star. Word Stars and Reward Credits remain separate. Single-word practice is available from a detail card and does not complete the three-word daily step.

## Family device saves

Parent Desk → Secure family learning → Move game progress between devices. Select matching local and cloud explorers. Save on the first device, sign in to the same parent account on the second, create/select the matching local explorer and Restore. Save subsequent changes before switching devices again. This is explicit snapshot synchronisation, not automatic background or concurrent merge.

Snapshots include only one learner's game profile/run, Word Kingdom, Science and notebook. They exclude login tokens, API secrets, audio recordings and other learners. They do not alter the server-verified lesson assessment or XP ledger. Restoration replaces the selected local learner, preserving others. Export a device backup before restoring when there is unsaved work on both devices. A stale revision is rejected, including two simultaneous first saves; no automatic last-write-wins merge. Local reset and cloud assessment reset do not delete cloud snapshots.

Database migration: `20261016071631_device_learning_snapshots.sql`. RLS permits only an active owning parent; anonymous access is denied. The RPC is security invoker. Snapshot contents are device-reported backup data, never trusted as server-assessed educational evidence. The SQL copy in `backend/sql/device-snapshots.sql` is used by the isolated database test.

## Content readiness and generation

The secure desk shows due reviews, new approved missions and pending adult reviews. The backend now reuses pending content for the same skill across days, in addition to approved content and same-day request deduplication. Existing authentication, free-tier confirmations, daily caps, cooldown, schema/semantic checks and adult approval are retained. No provider call is made just to populate the daily plan. Automatic scheduled provider jobs, paid fallback and new audio generation have not been enabled.

## Testing with Adam

Software tests cannot establish whether Adam understands a question comfortably. Try a 10–15 minute session and use the existing Parent Desk observation controls: independent understanding, wording needed explanation, visual model helped, or unfamiliar topic. No voice or free-text response is recorded. Use these observations before expanding the full maths teaching sequence to every strand.

Actual Safari/iPad and Samsung hardware/audio checks remain distinct from Chromium viewport automation. Browser/device voice availability varies; no new Gemini audio is claimed.
