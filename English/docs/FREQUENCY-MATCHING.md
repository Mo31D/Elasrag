# Frequency preparation and matching

## Verified supplied artifact — 12 November 2026

The user supplied six ZIP archives and MANIFEST.json after the online download
was blocked. The former download blocker is resolved by these uploads. Source
identity is checked against the supplied manifest, not an independently downloaded
upstream copy. The [official LancsLex page](https://lancslex.lancaster.ac.uk/) and
[lemma download URL](https://lancslex.lancaster.ac.uk/lists/BNC2014-lemma.tsv) remain
provenance references; original creation/download date was not independently verified.

`tools/reassemble_bnc.py` sorted manifest part indexes 1–6, ignoring upload prefixes.
All six archive sizes/SHA-256 hashes, member SHA-256 hashes and ZIP CRC checks passed.
Each extracted part has its header; only part 1's header enters the combined file.
Five repeated headers were checked byte-for-byte and skipped. Data bytes and CRLF
line endings were preserved rather than rewritten through a CSV serialiser.

| Integrity check | Verified result |
| --- | --- |
| Parts 1–5 data rows | 148,329 each |
| Part 6 data rows | 148,324 |
| Combined data rows | 889,969 |
| Combined bytes | 86,185,543 |
| Original SHA-256 | `fb8fbd3e41980c452be03faa7358e269a560aea52da74e51c192e91f68b80c75` |
| Uploaded manifest SHA-256 | `eb86236cb58cb3f7a874f4199b5a387510df7207a87b84374e243b08e123c71d` |

The tool validates expected member names without extract-all, rejects inconsistent
manifests, unexpected members/headers, missing/duplicate parts and hash/row failures,
and promotes its staged directory only after full verification. Existing output
is never overwritten. Source files and the detailed integrity report stay private.

## Observed format and matching

The original is UTF-8 without BOM, literal tab-separated text with CRLF endings.
All 889,969 rows have eight fields, and all Frequency fields parse as nonnegative
integer counts. The inspected header is:

| Column | Treatment |
| --- | --- |
| Position 1 | Combined lemma and class suffix, split at the final underscore; **not rank** |
| Frequency | Absolute count retained in private observations |
| ARF (average reduced frequency) | Separate statistic; not imported as count or per-million frequency |
| Range | Distribution statistic; preserved in original only |
| Range % | Distribution percentage; not a token-frequency denominator |
| CV (coefficient of variation) | Dispersion statistic; original only |
| Juilland's D | Dispersion statistic; original only |
| DP (deviation of proportions) | Dispersion statistic; original only |

There is no source rank or per-million column. Both remain null. We do not infer
rank from row position, manufacture a corpus denominator or replace count with ARF.
Literal quote characters in source keys are not CSV quoting syntax in this adapter.

Lancaster's [Words exercise, pages 2 and 4](https://lancsbox.lancaster.ac.uk/data/materials/Ex_Words_answers.pdf)
explains lemma grouping and explicitly identifies N/V/J suffixes. The linked
[CLAWS7 reference](https://ucrel.lancs.ac.uk/claws7tags.html) supports the I preposition
family. The reviewed map is N→noun, V→verb, J→adjective, I→preposition. It deliberately
does not claim a full class inventory or map every unfamiliar suffix by intuition.
Class-level counts are not sense-level counts and do not diagnose tagging accuracy.

A streaming adapter verified the entire original hash, field counts, UTF-8 and
integer count fields, retaining only rows relevant to the target lemmas for matching.
It found **19 exact matches, one ambiguous result and zero unmatched targets**.
The noun target `concern` has an additional F-class row. The reviewed map does not
resolve that class, so the conservative matcher retains ambiguity even though an
N candidate exists. F may cover formula/unclassified/foreign categories in CLAWS;
we do not assume this particular occurrence is a harmless foreign-word match.
Manual source-class review remains necessary. Other POS candidates are kept separate;
no spelling-only aggregation or manual stem substitution is performed.

The config, raw candidate observations, selected counts, ambiguity diagnostics and
full integrity evidence are in ignored `English/private/bnc2014-upload/`. No source
rows or per-word observations are included in the public PR. All 20 public frequency
records have `withheld_pending_rights`, with null count/rank/perMillion/match. A new
nullable count field supports the actual measure without pretending a rank exists.

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

## Reproduce privately

With the user's attachments present:

```sh
python English/tools/reassemble_bnc.py \
  --manifest /path/to/MANIFEST.json \
  --archives /path/to/upload-directory \
  --destination English/private/bnc2014-upload

python English/tools/match_frequency.py \
  --source English/private/bnc2014-upload/BNC2014-lemma.tsv \
  --config English/private/bnc2014-upload/frequency-config.json \
  --output English/private/bnc2014-upload/frequency-matches.json
```

The first command requires a new output directory. The second was run successfully
on the reconstructed artifact. Its private configuration contains `adapter` set to
`lancslex_lemma`, the verified original `sha256`, `localUse` set to
`noncommercial_private`, the licence evidence URL, and `posMap` with exactly the
reviewed N/V/J/I mapping above. It reads the source in bounded memory. The generic
configurable TSV adapter remains available for other inspected formats; it is not
used on this combined-key export.

No public export switch exists. Output paths resolve inside ignored private storage.
Rows are matched per stable target lexeme, with duplicate compatible rows or unknown
classes left ambiguous. Source line locators never become ranks. Counts of zero
are valid numbers, while absent measurements remain null. Changes to the pinned
source hash fail closed. Inflections, case, homograph suffixes and punctuation are
not silently rewritten; only Unicode NFC and surrounding whitespace are normalised.

Tests use explicitly synthetic data and cover byte-exact reconstruction in shuffled
upload order, repeated-header errors, missing parts, archive/member/original hash
failures, row errors, private output confinement, combined lemma/class parsing,
unknown-class ambiguity, literal quotes, POS separation and absent ranks. Real-data
integration was run separately; test fixtures do not embed protected source rows.
