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
            lambda d: d['vocabulary']['words'][0]['frequency'].__setitem__('count', 10),
            lambda d: d['lessons']['lessons'][0]['senses'][0].__setitem__('translationAr', ''),
            lambda d: d['lessons']['lessons'][0]['examples'].pop(),
            lambda d: d['lessons']['lessons'][0]['pronunciation'].__setitem__('audioId', 'missing'),
            lambda d: d['lessons']['lessons'][0]['pronunciation'].__setitem__('primaryStress', 99),
            lambda d: d['audio']['assets'][0].__setitem__('recordingType', 'human'),
            lambda d: d['audio']['assets'][0].pop('licence'),
            lambda d: d['vocabulary']['words'][0].__setitem__('id', 'wrong'),
            lambda d: d['lessons']['lessons'][0]['pronunciation'].__setitem__('guidanceAr', 'تعديل بعد المراجعة'),
            lambda d: d['verification']['records'].pop(),
            lambda d: d['verification']['records'][0].__setitem__('lessonSha256', '0' * 64),
        ]
        for i, mutate in enumerate(mutations):
            with self.subTest(mutation=i):
                data = copy.deepcopy(load())
                mutate(data)
                self.assertTrue(validate(data))

    def test_release_cannot_pass_by_status_labels_alone(self):
        data = load()
        for lesson in data['lessons']['lessons']:
            lesson['reviewStatus'] = 'linguistically_reviewed'
            lesson['pronunciation']['verificationStatus'] = 'verified'
        errors = validate(data, release=True)
        self.assertTrue(any('playable reference missing' in e for e in errors))
        self.assertTrue(any('public frequency evidence withheld or incomplete' in e for e in errors))


if __name__ == '__main__':
    unittest.main()
