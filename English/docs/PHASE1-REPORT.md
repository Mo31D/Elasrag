# Phase 1 review report

## Repository and scope

Continued PR #46 on `feature/english-phase1-foundation` from
`333a38b7365ad76fd899c8ae619b6708c0d5d58d`. Fetched main and the PR branch before
editing. Read the full PROJECT-PLAN and previous report. Main remains
`4ea1bb46c53e7e84055b463a155e6e1d3683b225`; English originally contained only the plan.
No AGENTS.md was found. Root dependencies, backend and workflows belong to other
projects and remain untouched. All changes stay inside English. The authoritative
plan, vocabulary IDs and exact two ten-word session memberships are preserved.

This is still Phase 1. No UI, deployment, backend, learner data or automatic merge.

## Completed follow-up

1. Extracted the supplied six ZIP archives in manifest part order, ignoring upload
   filename prefixes. Verified every archive size/hash, member hash and ZIP CRC,
   each part's data rows, and identical repeated headers. Skipped only the five
   repeated headers in the combined file. Original integrity matches exactly:
   **889,969 data rows, 86,185,543 bytes**, SHA-256
   `fb8fbd3e41980c452be03faa7358e269a560aea52da74e51c192e91f68b80c75`.
   Original/parts/manifest and verification output remain in ignored private storage.
2. Inspected UTF-8 literal TSV with CRLF and eight columns. `Position 1` is a combined
   lemma/class key, not a rank; `Frequency` is absolute count. Added a streaming,
   hash-pinned adapter and verified the full real dataset. Private matching found
   **19 exact lemma/POS matches, 1 ambiguous, 0 unmatched**. The additional F-class
   candidate for concern remains unresolved rather than silently discarded. No ranks
   or per-million figures are manufactured. Public records retain null measurements
   with `withheld_pending_rights`; a nullable count field accommodates the real measure.
   [FREQUENCY-MATCHING.md](FREQUENCY-MATCHING.md) documents fields, POS evidence,
   reconstruction, commands and rights. Upload integrity does not independently
   authenticate the source against Lancaster's online bytes.
3. Inspected pronunciation/audio sections for all twenty words. Located five
   UK-labelled candidates; confirmed speaker and file-level CC BY-SA 4.0 for
   require and additional. The other three licences remain unconfirmed due to
   file-page access failures. None auditioned or accepted; twenty production audio
   entries remain unavailable. This is a scoped search, not proof of global absence.
4. Checked all twenty written pronunciation references on Cambridge's UK pages.
   Corrected convenient's four careful syllables; clarified acknowledge's ck,
   additional's ti, suitable variants, weak vowels and non-rhotic contexts. Written
   reference checking does not certify accent, audio quality or learner performance.
5. Reviewed all twenty explanations/patterns/exercise keys and sixty sentence pairs
   for British usage, grammar and Egyptian Arabic meaning. Refined concern's gloss,
   require's explanation, acknowledge's email example and capable's Arabic adjective.
   This is assistant editorial review, not independent human signoff.
6. Inspected Oxford site terms without finding a clear grant for this public
   derived dataset; retained the existing CEFR/source-mapping withholding. Recorded
   Lancaster restrictions without mislabelling every individual fact as protected.
   No protected dataset, copied definition/example or restricted audio is published.
7. Added a separate audit dataset/schema with per-word source URLs, source-page
   hashes, scope, findings, audio candidate evidence and reviewed lesson hashes.
   Validation rejects edits that would silently retain a stale review.

## Verified deliverables and tests

Six public JSON datasets and seven JSON Schema contracts now support twenty original
lesson drafts, sixty translated examples, one hundred exercises and the same two
sessions of ten distinct target words. Local progress remains a contract only;
no private learner records are committed.

- `python English/tools/validate.py`: PASS.
- `python -m unittest discover -s English/tools -p 'test_*.py'`: PASS, 19 test methods;
  includes 16 corruption subcases, ten matcher/adapter methods and five reconstruction methods and a check that changing
  status labels alone cannot bypass missing-audio/frequency release gates.
- `python English/tools/validate.py --release`: expected exit 1, **122 blockers**:
  20 CEFR publication gates, 20 independent editorial review gates, 20 final
  pronunciation verification gates, 20 missing playable references, 20 pending
  audition/teaching signoffs, 20 withheld public frequency evidence gates and two unready sessions.
- Diff whitespace checks pass. Stable IDs and session JSON match the previous PR
  commit. No browser/audio playback tests apply to implemented functionality;
  audio audition and future iPhone playback checks have not been performed.

Real-data reconstruction and private integration are now verified separately from
synthetic tests. Legal clearance, human review and release readiness are not implied.

## Remaining blockers and next steps

1. Resolve the one remaining source-class ambiguity and permission for public
   combined frequency observations. Download/format/integrity are no longer blockers.
   The CC BY-NC-ND 4.0 restrictions remain; the upload does not grant new rights.
2. Resolve Oxford-derived CEFR publication permission or a documented lawful basis.
   Keep values withheld until then. Oxford 5000 expansion remains outside this phase.
3. Complete file-level licence evidence for the three remaining candidates, audition
   the two confirmed-licence files and seek suitable sources for the other words.
   Check actual accent and word/POS before accepting any asset. Source sentence audio
   and listening contrasts separately. Reference links alone are not audio assets.
4. Have a qualified British-English pronunciation reviewer and Egyptian Arabic
   reviewer check the corrected content and recordings; retain evidence and update
   lesson hashes after any edits. Learner trials will test clarity and usefulness.
5. Rerun all checks and review the foundation before Phase 2. UI, persistence,
   microphone and Safari implementation remain later work. Do not merge or deploy
   this partial foundation as a release-ready tutor.

Detailed review: [VERIFICATION.md](VERIFICATION.md). Rights/source history:
[SOURCES.md](SOURCES.md). Architecture: [ARCHITECTURE.md](ARCHITECTURE.md).
