# Phase 1 review report

## Repository assessment

Fetched `origin/main` before editing; assessed commit
`4ea1bb46c53e7e84055b463a155e6e1d3683b225`.
Read the entire `English/PROJECT-PLAN.md`. Initially `English/` contained only that
plan. No AGENTS.md instructions were found. Root package.json is an unrelated
Express application; existing workflows target other projects. Do not inherit
that backend or change root dependencies/workflows for this static content phase.
All proposed files are inside `English/`; the plan is preserved unchanged.
Branch: `feature/english-phase1-foundation`.

The plan describes a complete first application across later phases. This task
implements only Phase 1 preparatory work. Its conceptual combined Word object has
been separated into linked vocabulary, lesson, source and resource records as the
current request requires. This is a storage refinement, not a change to ten-word
sessions or three-dimensional learning assessment.

## Delivered and validated

- Five public JSON datasets and six JSON Schema contracts, including future private
  progress/session-resume storage.
- Two content-review sessions of exactly ten distinct words, no shared targets.
- Twenty original lesson drafts, sixty original sentences with Egyptian Arabic
  translations, one hundred exercises, usage notes and memory associations.
- Twenty explicit unavailable-audio records; no fabricated audio or frequency.
- Schema/reference validator and mutation tests; architecture, preparation,
  educational-quality, pronunciation, rights and privacy documentation.

Validation run: `python English/tools/validate.py` passed.
`python English/tools/test_validation.py` passed: three test methods, including
12 corruption subcases and a release-gate rejection check. Tests reject wrong
session sizes, repeated targets, broken IDs, invalid CEFR, invented frequency,
missing Arabic, too few examples, missing audio metadata, impossible stress
positions and misleading human-recording claims.

`--release` fails intentionally because publication of CEFR metadata is withheld,
editorial/phonetic review is pending and sessions are not ready. A passing draft
validator must never be reported as verified learning efficacy or legal clearance.
No browser testing applies because no UI or audio playback has been implemented.

## Unresolved deliverables

This is a preparatory draft, not full acceptance of the twenty verified lessons.
The supplied Oxford PDF verifies candidate selection privately but does not grant
clear redistribution rights or contain pronunciation. Public CEFR/source mappings
are withheld. The original pronunciation guidance is not independently verified.
Authentic licensed recordings, listening discrimination materials and sentence
audio are missing. No Lancaster frequency resource or Oxford 5000 source was
supplied. No licensed image assets are needed for the mental associations.

No progress, recordings, credentials or personal learner profile are committed.
Private source evidence is ignored; it is not part of the deliverable and requires
the supplied PDF for independent reproduction. No UI, deployment or backend exists
in this change. No merge is authorised.

## Recommended sequence

1. Resolve Oxford-derived field publication rights; obtain the exact Lancaster
   lemma-frequency artifact and its terms. Review source/POS mappings and enable
   only permitted metadata. Obtain Oxford 5000 separately when expansion is needed.
2. Verify each pronunciation guide with an appropriate British reference; secure
   usable human recordings and record rights. Author actual listening contrasts.
   Complete bilingual editorial review and rerun the release gate.
3. Submit the corrected educational foundation for review before Phase 2. Then
   build the minimal expandable Words list and session navigation, with progressive
   detail and correct RTL/LTR. Do not begin this in Phase 1.
4. Implement accessible audio/optional local recording; test slow/normal/repeat
   and microphone denial on real iPhone Safari, iPad and desktop.
5. Implement transactional IndexedDB progress, exact resume, backup import/export
   and independent review scheduling; test interruptions, migrations and restores.
6. Pilot both sessions with the learner, revise from observed needs, then expand
   content. Consider private sync/backend only when a demonstrated need requires it.
