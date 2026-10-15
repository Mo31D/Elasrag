# Word Kingdom — DfE Curriculum Provenance Contract

## Authority and exact scope

Primary source (government):
[DfE English National Curriculum: Key Stages 1 and 2 (2014)](https://assets.publishing.service.gov.uk/media/5a7de93840f0b62305b7f8ee/PRIMARY_national_curriculum_-_English_220714.pdf)

Curriculum source: [GOV.UK English programmes of study](https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study).

**EYFS (Reception)** — no single DfE-prescribed statutory vocabulary word list. Our visual everyday-language examples are labelled **EYFS contextual practice**, not "required school words". The statutory EYFS framework focuses on communication, language, literacy and play-based learning.

**Years 1–2** — DfE Appendix 1 describes spelling requirements, phonics and examples. The example words in the right-hand column are **non-statutory**. They must be labelled "DfE spelling example", NOT "statutory year-specific word list". Different schools may use different systematic synthetic phonics programmes, so the exact classroom order is **not guaranteed** without a school's own curriculum/spelling schedule.

**Years 3–4** — Appendix 1 contains a **joint statutory 100-entry spelling list**, printed p.54. Each group entry is represented by at least one word card. Do not assert that all were taught specifically in Year 3 rather than Year 4.

**Years 5–6** — Appendix 1 contains a **joint statutory 100-entry spelling list**, printed p.61. Each group entry is represented by at least one word card. Do not assert Year 5 versus Year 6 allocation.

## Implementation

- `curriculum-dfe.js`: manually checked statutory entries, exact exception-word example sets and selected phonics-pattern examples, and page links. Joint group lists each have 100 entries. Where an original source entry contains multiple word forms (e.g., `busy/business`, `accident(ally)`, `equip`), `DFE_*_VARIANTS` records learning-card forms. The source entries sometimes normalise explanatory parentheses and asterisks for reliable matching; refer to the linked PDF for printed typography.
- `curriculum-index.js`: every verified learning card has an explicit source class (`statutory` or `dfe-example`), introduction group, pattern label, printed page and URL. No heuristic matching to the DfE by topic.
- `words-data.js`, `words-expanded.js`: the older 347 editorial words remain so earlier learner attempts and saved progress do not disappear. They are shown as optional enrichment **unless independently cross-referenced** to an actual official appendix term.
- `dfe-new-cards.js`: 242 further complete meaning/example cards restricted to words whose forms are present in Appendix 1. Hard checks reject new cards with no official source mapping.
- `words-academic.js`: 32 teacher-reviewed words used in classroom instructions and English, maths, science, history and geography. They are explicitly labelled **School vocabulary · supplementary**, not statutory spelling-list words. Together there are now 621 unique cards.
- The default library view includes DfE-sourced content and a clearly labelled EYFS contextual practice track. `Optional enrichment` is a separate manual choice, not mixed into official statutory labels.
- Word details link back to the DfE appendix, state whether the item is a statutory list entry or a non-statutory example, and name the spelling topic where available.
- Image cues are often generic vector illustrations rather than faithful object depictions. Abstract/frequent grammatical words cannot score picture recognition based on a vague icon. Three core facets remain: meaning, spelling and sentence ordering.

## Pedagogy

For children who need foundational English practice, first assess individual receptive vocabulary, decoding/phonics, written spelling, sentence production and optional speaking confidence *separately*. Build from observed gaps without labelling the child as a lower school year, while offering age-appropriate mystery/game contexts.

Words learnt through the English programme also appear in science, mathematics and broader reading. Cross-curricular words may be offered as clearly labelled supplementary school language when they are accurate, age-staged and adult-reviewed; they must not be described as statutory spelling-list entries or a school's exact teaching sequence.

## Change acceptance — mandatory

Reject every candidate new word unless it has:
1. The actual word form, definition, age-appropriate British-English sentence and correct spelling.
2. Verified provenance: document, source class (statutory word list / explicit non-statutory DfE example / contextual enrichment), group/year or topic, page or statutory clause.
3. An adult content-review flag (AI prose is draft content, not automatic approved fact).
4. No duplicate stable word ID; no overwriting learner attempts.
5. A test that full statutory Years 3–4 and Years 5–6 list entry coverage stays 100 of 100 each.

New editions of the Department for Education curriculum should be compared to the baseline before re-labelling words. Changes to school-specific phonics and spelling sequences need the school's published plan; the National Curriculum alone cannot prove a specific classroom week's taught words.

## Current production limitation

The Google voice caching pipeline is implemented separately; **no generated clip should be presented as approved unless it has been generated and explicitly reviewed**. In particular a phonics rule may require /phoneme/ + grapheme demonstrations beyond simply speaking the whole word. The browser speech alternative is never labelled as premium Gemini narration.
