"""Mutation tests for the validation boundary, not linguistic verification."""
import copy
import unittest
from validate import load, validate


class ValidationTests(unittest.TestCase):
    def test_draft_valid(self):
        self.assertEqual(validate(load()), [])

    def test_release_blocked(self):
        self.assertTrue(validate(load(), release=True))

    def test_rejects_corruption(self):
        mutations = [
            lambda d: d['sessions']['sessions'][0]['wordIds'].pop(),
            lambda d: d['sessions']['sessions'][1]['wordIds'].__setitem__(0, 'word-receipt'),
            lambda d: d['sessions']['sessions'][0]['wordIds'].__setitem__(0, 'missing'),
            lambda d: d['vocabulary']['words'][0].__setitem__('cefr', 'B3'),
            lambda d: d['vocabulary']['words'][0]['frequency'].__setitem__('rank', 10),
            lambda d: d['lessons']['lessons'][0]['senses'][0].__setitem__('translationAr', ''),
            lambda d: d['lessons']['lessons'][0]['examples'].pop(),
            lambda d: d['lessons']['lessons'][0]['pronunciation'].__setitem__('audioId', 'missing'),
            lambda d: d['lessons']['lessons'][0]['pronunciation'].__setitem__('primaryStress', 99),
            lambda d: d['audio']['assets'][0].__setitem__('recordingType', 'human'),
            lambda d: d['audio']['assets'][0].pop('licence'),
            lambda d: d['vocabulary']['words'][0].__setitem__('id', 'wrong'),
        ]
        for i, mutate in enumerate(mutations):
            with self.subTest(mutation=i):
                data = copy.deepcopy(load())
                mutate(data)
                self.assertTrue(validate(data))


if __name__ == '__main__':
    unittest.main()
