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



class LancsLexAdapterTests(unittest.TestCase):
    def run_adapter(self, body, word=WORD, corrupt_hash=False):
        import tempfile
        from pathlib import Path
        from match_frequency import LANCSLEX_HEADER, parse_lancslex
        raw = ('\t'.join(LANCSLEX_HEADER)+'\r\n'+body).encode()
        config = {**CONFIG, 'sha256': hashlib.sha256(raw).hexdigest(),
                  'posMap': {'N':'noun','V':'verb','J':'adjective','I':'preposition'}}
        if corrupt_hash:config['sha256']='0'*64
        with tempfile.TemporaryDirectory() as d:
            path=Path(d)/'synthetic.tsv';path.write_bytes(raw)
            return parse_lancslex(path, config, [word])

    def test_combined_key_not_rank_and_pos_separation(self):
        meta, rows=self.run_adapter('record_N\t15\t1\t1\t1\t1\t1\t1\r\nrecord_V\t30\t1\t1\t1\t1\t1\t1\r\n')
        result=match([WORD],rows)[0]
        self.assertEqual(meta['rowCount'],2)
        self.assertEqual(result['observation']['count'],15)
        self.assertIsNone(result['observation']['rank'])
        self.assertIsNone(result['observation']['perMillion'])

    def test_unknown_class_remains_ambiguous(self):
        _,rows=self.run_adapter('record_N\t15\t1\t1\t1\t1\t1\t1\r\nrecord_F\t1\t1\t1\t1\t1\t1\t1\r\n')
        self.assertEqual(match([WORD],rows)[0]['status'],'ambiguous')

    def test_last_underscore_and_literal_quote(self):
        word={**WORD,'headword':'a_"b'}
        _,rows=self.run_adapter('a_"b_N\t2\t1\t1\t1\t1\t1\t1\r\n',word)
        self.assertEqual(match([word],rows)[0]['status'],'matched')

    def test_malformed_count_and_hash(self):
        with self.assertRaises(ValueError):self.run_adapter('record_N\tNaN\t1\t1\t1\t1\t1\t1\r\n')
        with self.assertRaises(ValueError):self.run_adapter('record_N\t1\t1\t1\t1\t1\t1\t1\r\n',corrupt_hash=True)

if __name__ == '__main__': unittest.main()
