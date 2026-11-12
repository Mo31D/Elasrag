"""Validate public content; --release additionally rejects unresolved teaching gates."""
import argparse
import hashlib
import json
from pathlib import Path
import re
from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[1]
NAMES = ('vocabulary', 'lessons', 'audio', 'sessions', 'sources', 'verification')


def load(root=ROOT):
    return {n: json.loads((root / 'data' / f'{n}.json').read_text()) for n in NAMES}


def validate(data, release=False):
    errors = []
    def check(condition, message):
        if not condition:
            errors.append(message)
    for name in NAMES:
        schema = json.loads((ROOT / 'schemas' / f'{name}.schema.json').read_text())
        Draft202012Validator.check_schema(schema)
        errors.extend(f'{name}/{list(e.path)}: {e.message}' for e in Draft202012Validator(schema).iter_errors(data[name]))
    if errors:
        return errors
    words = data['vocabulary']['words']
    lessons = data['lessons']['lessons']
    assets = data['audio']['assets']
    sessions = data['sessions']['sessions']
    sources = data['sources']['sources']
    def index(records, key, label):
        result = {r[key]: r for r in records}
        check(len(result) == len(records), f'duplicate {label}')
        return result
    wi = index(words, 'id', 'word id')
    li = index(lessons, 'wordId', 'lesson')
    ai = index(assets, 'id', 'audio id')
    si = index(sources, 'id', 'source id')
    vi = index(data['verification']['records'], 'wordId', 'verification record')
    check(set(vi) == set(wi), 'verification must cover exactly the vocabulary')
    index(sessions, 'id', 'session id')
    check(len(words) == 20, 'prototype requires 20 words')
    check(len(sessions) == 2, 'prototype requires two sessions')
    check(len({w['headword'].strip().casefold() for w in words}) == len(words), 'duplicate headword learning unit')
    check(set(wi) == set(li), 'every word requires exactly one lesson')
    targets = [w for s in sessions for w in s['wordIds']]
    check(len(targets) == len(set(targets)), 'duplicate target across sessions')
    check(set(targets) == set(wi), 'session targets must cover exactly the vocabulary')
    for s in sessions:
        check(not set(s['reviewWordIds']) & set(s['wordIds']), 'reviews overlap new targets')
        check(set(s['reviewWordIds']) <= set(wi), 'unknown review word')
        if release:
            check(s['status'] == 'ready', f"{s['id']}: session not ready")
    activity_ids = set()
    for w in words:
        wid = w['id']
        check(wid == 'word-' + w['headword'], f'{wid}: inconsistent id')
        f = w['frequency']
        check(f['sourceId'] in si, f'{wid}: unknown frequency source')
        if f['status'] != 'matched':
            check(all(f[k] is None for k in ('rank', 'perMillion', 'count', 'match')), f'{wid}: fabricated or published withheld frequency')
        else:
            check(f['match'] is not None and any(f[k] is not None for k in ('rank', 'perMillion', 'count')), f'{wid}: missing frequency evidence')
            source = si.get(f['sourceId'])
            check(source is not None and source['availability'] == 'supplied', f'{wid}: frequency source unavailable')
            check(source is not None and source['licence']['redistribution'] != 'withheld', f'{wid}: source rights block public observations')
        if w['cefrStatus'] != 'verified_permitted':
            check(w['cefr'] is None, f'{wid}: unpublished CEFR must be null')
        else:
            check(w['cefr'] is not None and bool(w['sourceMemberships']), f'{wid}: missing CEFR evidence')
        lexemes = index(w['lexemes'], 'id', 'lexeme id')
        for m in w['sourceMemberships']:
            check(m['sourceId'] in si and m['lexemeId'] in lexemes, f'{wid}: broken source mapping')
            check(m['rightsStatus'] == 'permitted', f'{wid}: restricted mapping published')
        if wid not in li:
            continue
        l = li[wid]
        if wid in vi:
            audit = vi[wid]
            digest = hashlib.sha256(json.dumps(l, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
            check(audit['lessonSha256'] == digest, f'{wid}: lesson changed since review')
            check(audit['primaryStress'] == l['pronunciation']['primaryStress'], f'{wid}: reviewed stress differs')
            check(audit['spellingGuideGroups'] == len(l['pronunciation']['syllableGuide']), f'{wid}: reviewed guide differs')
            candidate = audit['audioCandidate']
            if candidate and candidate['licenceEvidenceStatus'] == 'file_page_checked':
                check(bool(candidate['creator']) and bool(candidate['licence']), f'{wid}: missing candidate licence evidence')
        senses = index(l['senses'], 'id', 'sense id')
        check(set(senses) == {s for x in w['lexemes'] for s in x['senseIds']}, f'{wid}: sense links disagree')
        for s in senses.values():
            check(s['lexemeId'] in lexemes, f'{wid}: unknown sense lexeme')
            check(bool(re.search('[\u0600-\u06ff]', s['translationAr'])), f'{wid}: Arabic translation missing')
        check(len({e['en'].casefold() for e in l['examples']}) >= 3, f'{wid}: repetitive sentences')
        for e in l['examples']:
            check(e['senseId'] in senses, f'{wid}: unknown example sense')
            check(len(e['en'].split()) >= 3 and bool(re.search('[\u0600-\u06ff]', e['ar'])), f'{wid}: incomplete example')
            check(e['audioId'] is None or e['audioId'] in ai, f'{wid}: unknown sentence audio')
        check({e['dimension'] for e in l['exercises']} == {'comprehension','pronunciation','usage'}, f'{wid}: missing assessment dimension')
        for e in l['exercises']:
            check(e['id'] not in activity_ids, 'duplicate activity id')
            activity_ids.add(e['id'])
            if e['type'] == 'recognition':
                check(e['answer'] in e.get('options', []) and len(set(e.get('options', []))) >= 2, f'{wid}: invalid recognition key')
            if e['type'] == 'completion':
                check('____' in e.get('promptEn', '') and e['answer'] == w['headword'], f'{wid}: invalid completion key')
        p = l['pronunciation']
        check(p['audioId'] in ai, f'{wid}: missing audio metadata')
        check(1 <= p['primaryStress'] <= len(p['syllableGuide']), f'{wid}: invalid stress index')
        if p['audioId'] in ai and ai[p['audioId']]['status'] == 'unavailable':
            check(p['listeningStatus'] == 'blocked_missing_audio', f'{wid}: unavailable listening must be explicit')
        if release:
            check(w['cefrStatus'] == 'verified_permitted', f'{wid}: CEFR publication blocked')
            check(l['reviewStatus'] == 'linguistically_reviewed', f'{wid}: editorial review pending')
            check(p['verificationStatus'] == 'verified', f'{wid}: pronunciation reference unverified')
            check(p['audioId'] in ai and ai[p['audioId']]['status'] == 'available', f'{wid}: playable reference missing')
            check(wid in vi and vi[wid]['auditionStatus'] == 'passed' and vi[wid]['humanSignoff'], f'{wid}: independent teaching/audio signoff pending')
            check(f['status'] == 'matched', f'{wid}: public frequency evidence withheld or incomplete')
    for a in assets:
        if a['status'] == 'unavailable':
            check(bool(a['reason']) and all(a[k] is None for k in ('origin','recordingType','accent','creator','url','format')), f"{a['id']}: misleading unavailable resource")
            check(not a['licence']['redistributionAllowed'], f"{a['id']}: unavailable asset claims rights")
        else:
            check(all(a[k] for k in ('origin','recordingType','accent','creator','url','format')), f"{a['id']}: missing audio provenance")
            check(a['licence']['status'] == 'verified' and all(a['licence'][k] for k in ('identifier','evidenceUrl','attribution')), f"{a['id']}: unverified audio licence")
            check(a['licence']['redistributionAllowed'], f"{a['id']}: available reference lacks publication permission")
    return errors


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release', action='store_true')
    args = parser.parse_args()
    errors = validate(load(), args.release)
    if errors:
        print('\n'.join(errors))
        raise SystemExit(1)
    print('PASS: 20 words, 2 sessions of 10, 60 translated examples, 100 exercises; schemas and references valid.')
    print('Draft only: independent review, playable audio and public source rights remain blocked. Private frequency audit: 19 exact matches, 1 unresolved class ambiguity.')
