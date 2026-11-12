"""Private TSV inspection and conservative lemma/POS matching; never publishes data.

No Lancaster column names or tagset are assumed. Supply an inspected, hash-pinned
configuration. See docs/FREQUENCY-MATCHING.md. Public vocabulary is never edited.
"""
import argparse
import csv
import hashlib
import io
import json
import math
from pathlib import Path
import unicodedata

ROOT = Path(__file__).resolve().parents[1]
POS = {'noun', 'verb', 'adjective', 'adverb', 'preposition', 'pronoun',
       'determiner', 'conjunction', 'interjection', 'auxiliary', 'modal'}


def canonical(value):
    # No stemming, case folding, homograph suffix removal or punctuation deletion.
    return unicodedata.normalize('NFC', value.strip())


def inspect(raw):
    text = raw.decode('utf-8-sig')
    reader = csv.reader(io.StringIO(text), delimiter='\t')
    header = next(reader, [])
    if not header or len(set(header)) != len(header) or any(not h for h in header):
        raise ValueError('Empty or duplicate TSV headers')
    rows = list(reader)
    if any(len(row) != len(header) for row in rows):
        raise ValueError('Ragged TSV: do not silently realign fields')
    return {'sha256': hashlib.sha256(raw).hexdigest(), 'encoding': 'utf-8-sig',
            'delimiter': 'tab', 'headers': header, 'rowCount': len(rows)}, rows


def number(value, integer=False):
    if value == '' or value is None:
        return None
    if integer:
        if not value.isascii() or not value.isdecimal() or int(value) < 1:
            raise ValueError('Rank must be an explicit positive integer')
        return int(value)
    n = float(value)
    if not math.isfinite(n) or n < 0:
        raise ValueError('Frequency must be finite and nonnegative')
    return n


def parse(raw, config):
    meta, rows = inspect(raw)
    if config['sha256'] != meta['sha256']:
        raise ValueError('Source hash changed; inspect and approve its mapping again')
    if config['localUse'] != 'noncommercial_private' or not config['licenceEvidenceUrl'].startswith('https://'):
        raise ValueError('Document local use and licensing evidence')
    columns = config['columns']
    if not columns.get('lemma') or any(v is not None and v not in meta['headers'] for v in columns.values()):
        raise ValueError('Configured column absent from actual header')
    if set(columns) != {'lemma', 'pos', 'entryId', 'rank', 'perMillion', 'count'}:
        raise ValueError('Declare every column role, using null for absent fields')
    if not set(config['posMap'].values()) <= POS:
        raise ValueError('Invalid mapped POS')
    if not any(columns[k] for k in ('rank', 'perMillion', 'count')):
        raise ValueError('No frequency measure configured')
    result = []
    for line, values in enumerate(rows, 2):
        row = dict(zip(meta['headers'], values))
        def field(key):
            return row[columns[key]].strip() if columns[key] else None
        lemma = canonical(field('lemma'))
        if not lemma:
            raise ValueError(f'Empty lemma at line {line}')
        raw_pos = field('pos')
        count = field('count')
        if count not in (None, '') and (not count.isascii() or not count.isdecimal()):
            raise ValueError('Count must be an explicit nonnegative integer')
        result.append({'lemma': lemma, 'partOfSpeech': config['posMap'].get(raw_pos),
                       'rawPos': raw_pos, 'sourceEntryId': field('entryId'),
                       'sourceLine': line, 'rank': number(field('rank'), True),
                       'perMillion': number(field('perMillion')),
                       'count': int(count) if count not in (None, '') else None})
    return meta, result


def match(words, rows):
    by_lemma = {}
    for row in rows:
        by_lemma.setdefault(row['lemma'], []).append(row)
    results = []
    for word in words:
        same = by_lemma.get(canonical(word['headword']), [])
        for lexeme in word['lexemes']:
            candidates = [r for r in same if r['partOfSpeech'] == lexeme['partOfSpeech']]
            unknown_pos = any(r['partOfSpeech'] is None for r in same)
            if unknown_pos or len(candidates) > 1:
                status, reason, selected = 'ambiguous', 'missing_pos_or_multiple_rows', None
            elif len(candidates) == 1:
                selected = candidates[0]
                if all(selected[k] is None for k in ('rank','perMillion','count')):
                    status, reason, selected = 'unmatched', 'missing_measure', None
                else:
                    status, reason = 'matched', 'exact_lemma_pos'
            else:
                status, reason, selected = 'unmatched', 'lemma_or_pos_not_found', None
            results.append({'wordId': word['id'], 'lexemeId': lexeme['id'],
                            'status': status, 'reason': reason, 'observation': selected})
    return results


def write_private(path, result):
    path = Path(path).resolve()
    private = (ROOT / 'private').resolve()
    if not path.is_relative_to(private) or path == private:
        raise ValueError('Output must stay under English/private/; publication is disabled')
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, required=True)
    parser.add_argument('--config', type=Path)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    raw = args.source.read_bytes()
    if args.config:
        config = json.loads(args.config.read_text())
        meta, rows = parse(raw, config)
        words = json.loads((ROOT / 'data/vocabulary.json').read_text())['words']
        results = match(words, rows)
        write_private(args.output, {'source': meta, 'licenceEvidenceUrl': config['licenceEvidenceUrl'],
                                    'publication': 'withheld_pending_rights', 'matches': results})
        print(json.dumps({s: sum(r['status'] == s for r in results)
                          for s in ('matched', 'ambiguous', 'unmatched')}))
    else:
        meta, _ = inspect(raw)
        write_private(args.output, meta)
        print('Private format inspection saved; no matching or publication performed.')


if __name__ == '__main__':
    main()
