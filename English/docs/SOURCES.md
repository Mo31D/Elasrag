# Source assessment and preparation

Inspected 12 November 2026. A local user-supplied file named
`1-The_Oxford_3000_by_CEFR_level.pdf` is available. SHA-256:
`441aa79b39a720afbe78bf944f8df49bce9f61977c8ac2be9fbcbc81cd94046f`.
It is a 336,931-byte, unencrypted, tagged PDF 1.4 with a selectable text layer,
12 A4 pages and an Oxford University Press copyright notice. These observations
identify the supplied artifact; its official download origin was not independently
verified. It is not an Oxford 5000 or pronunciation dataset.

Available: printed headword, abbreviated POS, section CEFR, occasional homograph
numbers/sense glosses. Absent: stable entry IDs, definitions, examples, Arabic,
IPA, recordings, frequencies and explicit redistribution permission.

`pdftotext -layout` successfully extracts the text. The four-column layout means
linear text order is NOT lexical order. CEFR sections begin inside columns on
pages 7 and 10. Carry section labels down the relevant column, not across a row.
Preserve homograph distinctions such as numbered entries; repeated spelling with
a new POS is not automatically the same source entry. Page headers/footers must
not become vocabulary. Review page/column/POS against the source before import;
never use a regex-only extraction as authoritative classification.

Twenty candidate headwords and their selected POS/sections were checked in the
supplied material. Private local evidence is under ignored `English/private/`.
This evidence is not shipped in the PR. A reviewer with the supplied PDF can
repeat the check. Public CEFR and source membership fields are deliberately null
or empty, so the public snapshot does not pretend to fulfil verified CEFR delivery.
Original teaching text, ordinary headwords and independently authored usage
choices are included; neither the PDF nor a copied wordlist is redistributed.

## Rights boundary

No explicit redistribution grant was identified in the supplied PDF. This is an
unresolved permission question, not a claim that every factual CEFR assignment is
legally restricted. Conservatively withhold derived Oxford mapping data until the
applicable terms or permission are established. Do not apply a new blanket licence
to third-party material. Attribution is not permission. No dictionary definitions,
examples or audio have been copied. The original project content is identified as
such; a project-wide licensing decision remains with the owner.

The follow-up located the official Lancaster lemma download and identified its
CC BY-NC-ND 4.0 terms, but could not acquire its bytes due to a proxy 403. Actual
columns and observations remain uninspected. See [frequency investigation](FREQUENCY-MATCHING.md)
for exact source/licence URLs, access evidence and the implemented private matcher.
No Oxford 5000 source has been supplied. Five UK-labelled recording candidates
were found; two individual licences were confirmed, but none is yet accepted or
playable. See [verification](VERIFICATION.md).

Oxford's [site terms](https://www.oxfordlearnersdictionaries.com/terms-and-conditions.html)
were inspected, especially sections 2, 3 and 7. They did not establish a public
redistribution grant for the proposed Oxford-derived database. The paid Product
clauses should not be carelessly equated with terms for every public PDF; the exact
PDF permission remains unresolved. The conservative withholding decision stays.

## Preparation once sources are authorised

1. Record provider, exact title/edition, origin URL, retrieval date, hash and rights
   evidence, including redistribution, caching and derivative-use limitations.
2. Keep originals in private preparation storage. Extract PDF columns with page
   coordinates; inspect headings and homograph/POS boundaries manually. Preserve
   raw source entry IDs alongside stable internal IDs.
3. Normalise Unicode, whitespace and documented POS tag mappings. Do not remove
   distinctions by stripping all punctuation or lowercasing proper names blindly.
4. For BNC, inspect whether rows represent lemma, surface form, lemma/POS or sense;
   document spoken/written composition, denominator and rank/tie definition.
5. Match lemma + compatible POS first. Inflection-to-lemma changes require lexical
   evidence; do not stem blindly. Record exact/manual method and evidence. Corpus
   lemma frequency does not establish the frequency of each sense.
6. Preserve ambiguous candidates without assigning a best guess. Missing,
   ambiguous and unmatched are different states. Do not pool incompatible POS
   counts or corpus subsets. Never infer a rank from spelling similarity.
7. Promote only mappings with verified evidence and permitted public fields.
   Import source updates without regenerating IDs or deleting learning history.

A configurable private matcher is now implemented and tested on synthetic data;
its actual Lancaster adapter cannot be verified against unavailable bytes. Publication of more source-derived data is blocked by this
project's explicit source-integrity requirements.
