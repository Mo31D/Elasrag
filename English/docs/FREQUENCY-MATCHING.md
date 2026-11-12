# Frequency preparation and matching

## Actual source investigation — 12 November 2026

No Lancaster attachment was present in the session files or repository. The user
then authorised finding and downloading it online. The official [LancsLex page](https://lancslex.lancaster.ac.uk/)
links [BNC2014-lemma.tsv](https://lancslex.lancaster.ac.uk/lists/BNC2014-lemma.tsv)
and identifies the wordlist licence as [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/).
Its requested attribution is Brezina & Gablasova (2024, 2026); retain both citations
as supplied on the page, without implying the 2026 multiword book is this file's
verified edition.

The shell download failed at the proxy CONNECT stage with HTTP 403. The web reader
could read the landing page but rejected the download as `application/octet-stream`.
No TSV bytes were acquired. Therefore `.tsv` is the **advertised** format only:
encoding, delimiter, headers, row count, hash, POS coverage, rank fields, denominator
and corpus composition of this exact file remain **uninspected**. Do not describe
this as an inspected or imported dataset. The managed runtime reports unrestricted
egress, but observed access still failed; no access-policy workaround was attempted.

The separate lemma and lexeme downloads must not be assumed interchangeable. A
lemma-only table might pool POS; without a POS column/tag definition it cannot be
used for an exact lemma/POS match. No real match count or rank is reported.

## Rights decision

The [legal code](https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode.en),
sections 2(a), 3 and 4, permits noncommercial reproduction and private adaptation,
with conditions on attribution and sharing. It prohibits sharing adapted material;
simple format conversion alone does not necessarily create an adaptation. Whether
this application's extracted/combined frequency database is adapted material or
falls outside protected rights is not resolved here. Public metadata stays null;
the matcher writes only private results. Do not conclude that every individual
frequency fact is copyrighted or that every subset is prohibited. A specific
permission/rights review is needed before publishing a combined dataset.

No external message or permission request has been sent to Lancaster. No corpus,
wordlist, extracted ranks or frequency observations are included in the PR.

## Implemented boundary

`tools/match_frequency.py` uses Python's standard library. It has two operations:

```sh
python English/tools/match_frequency.py \
  --source English/private/BNC2014-lemma.tsv \
  --output English/private/format-report.json

python English/tools/match_frequency.py \
  --source English/private/BNC2014-lemma.tsv \
  --config English/private/frequency-config.json \
  --output English/private/frequency-matches.json
```

These commands require the actual downloaded file; neither was falsely reported
as run on Lancaster data. The first inspects UTF-8/UTF-8-BOM tab-separated input and
rejects duplicate/empty headers or ragged records. If the actual source differs,
write a separately reviewed adapter rather than guessing. The second requires a
configuration created after inspecting the file:

- `sha256`: exact inspected file hash; changes fail closed.
- `localUse`: `noncommercial_private` and `licenceEvidenceUrl`: actual licence URL.
- `columns`: explicit `lemma`, `pos`, `entryId`, `rank`, `perMillion`, `count` mappings
  to real headers, using null for absent fields. These are internal roles, **not
  claimed Lancaster headers**.
- `posMap`: explicit source tag → internal POS map supported by source documentation.

Results retain word and lexeme IDs, source line locator (never a rank), raw POS,
source entry ID when available, and unaltered supplied numeric observations.
Missing rank remains null even if the file is sorted. No row-number ranks,
re-ranking, denominator inference or summing across POS. Tied ranks stay tied.

Matching normalises only Unicode NFC and surrounding whitespace. It does not
stem, strip homograph numbers, fold case, infer inflections or combine senses.
Each target lexeme is matched separately. Duplicate lemma/POS rows or a missing/
unmapped POS for that lemma require review. Exact lemma with the wrong known POS
is unmatched. A row without any frequency measure is not a successful observation.
No sense-specific frequency is inferred from a lemma/POS match.

The output path is resolved and must be inside ignored `English/private/`, including
for symlink paths. There is no public export switch and no mutation of vocabulary
or sessions. Synthetic test fixtures are explicitly labelled; their numbers do
not enter educational content. Six matcher test methods exercise real failure
modes. Actual Lancaster integration remains blocked until bytes and field semantics
can be inspected. A later permissioned publishing step must separately validate
provenance and rights and preserve these stable IDs.
