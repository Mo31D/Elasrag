# English — Phase 1 foundation

Reviewable content and data contracts only. The authoritative specification remains
[PROJECT-PLAN.md](PROJECT-PLAN.md). No UI, backend, deployment or learner records
are included.

The public prototype contains 20 original lesson drafts in two sessions of exactly
10 words, 60 translated sentences and 100 exercises. These are **not yet verified,
release-ready lessons**: Oxford-derived CEFR assignments are withheld pending
rights clarification, pronunciation guidance has been checked against UK written references but awaits independent/audio review, and
playable recordings and Lancaster frequency observations are unavailable. The official Lancaster download was located, but access is blocked. Unknown values are null,
never zero or invented values. The user-authorised source-blocker exception applies.

Run from the repository root with Python 3.10+ and the development dependency:

```sh
python -m pip install -r English/requirements-dev.txt
python English/tools/validate.py
python -m unittest discover -s English/tools -p 'test_*.py'
python English/tools/validate.py --release
```

The first two checks pass. The last command must currently exit 1: it is the
educational release gate, not a failing structural validation. Automated checks
cannot certify naturalness, translation accuracy, phonetics or legal permission.

- [Architecture and progress contracts](docs/ARCHITECTURE.md)
- [Source assessment and preparation](docs/SOURCES.md)
- [Content rules and pronunciation](docs/CONTENT.md)
- [Frequency matching and download blocker](docs/FREQUENCY-MATCHING.md)
- [Reference, audio and bilingual review](docs/VERIFICATION.md)
- [Assessment, results and next steps](docs/PHASE1-REPORT.md)

Public JSON lives under `data/`; executable JSON Schema contracts under `schemas/`.
`schemas/progress.schema.json` specifies future private storage only; there is no
sample personal progress file. Audio entries describe absence, not playable assets.
