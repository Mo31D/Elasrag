"""Synthetic fixtures only: these values are NOT Lancaster observations."""
import copy
import hashlib
import unittest
from match_frequency import inspect, parse, match, write_private

RAW = b'lemma\tpos\trank\tpm\tcount\nrecord\tN\t9\t2.5\t25\nrecord\tV\t9\t1.5\t15\n'
CONFIG = {'sha256': hashlib.sha256(RAW).hexdigest(), 'localUse':'noncommercial_private',
          'licenceEvidenceUrl':'https://example.org/synthetic-test-licence',
          'columns':dict(lemma='lemma', pos='pos', entryId=None, rank='rank', perMillion='pm', count='count'),
          'posMap':{'N':'noun','V':'verb'}}
WORD = {'id':'word-record', 'headword':'record', 'lexemes':[{'id':'word-record-noun','partOfSpeech':'noun'}]}


class FrequencyTests(unittest.TestCase):
    def test_exact_pos_and_source_rank(self):
        meta, rows = parse(RAW, CONFIG)
        result = match([WORD], rows)[0]
        self.assertEqual(meta['rowCount'], 2)
        self.assertEqual(result['observation']['rank'], 9)
        self.assertEqual(result['observation']['count'], 25)
        self.assertEqual(rows[1]['rank'], 9)  # preserve ties; never row rank

    def test_no_rank_inference(self):
        config = copy.deepcopy(CONFIG); config['columns']['rank'] = None
        _, rows = parse(RAW, config)
        self.assertIsNone(match([WORD], rows)[0]['observation']['rank'])

    def test_ambiguity_and_missing_pos(self):
        _, rows = parse(RAW, CONFIG)
        self.assertEqual(match([WORD], rows + [rows[0]])[0]['status'], 'ambiguous')
        rows[0]['partOfSpeech'] = None
        self.assertEqual(match([WORD], rows)[0]['status'], 'ambiguous')

    def test_no_stemming_or_case_guess(self):
        _, rows = parse(RAW, CONFIG)
        for head in ('records', 'Record', 'record2'):
            word = {**WORD, 'headword':head}
            self.assertEqual(match([word], rows)[0]['status'], 'unmatched')

    def test_fail_closed_inputs(self):
        for raw in (b'lemma\tlemma\nx\tx\n', b'lemma\tpos\nx\n'):
            with self.assertRaises(ValueError): inspect(raw)
        with self.assertRaises(ValueError): parse(RAW + b'\n', CONFIG)
        config = copy.deepcopy(CONFIG); config['columns']['pos'] = 'invented'
        with self.assertRaises(ValueError): parse(RAW, config)
        for bad in ('NaN', 'inf', '-1'):
            raw = RAW.replace(b'2.5', bad.encode())
            config = {**CONFIG, 'sha256':hashlib.sha256(raw).hexdigest()}
            with self.assertRaises(ValueError): parse(raw, config)

    def test_private_output_only(self):
        with self.assertRaises(ValueError):
            write_private('English/data/leaked-frequency.json', {})


if __name__ == '__main__': unittest.main()
