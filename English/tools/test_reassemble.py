"""Synthetic six-part fixtures only; no source rows are embedded in tests."""
import copy
import json
from pathlib import Path
import tempfile
import unittest
import zipfile
from reassemble_bnc import ROOT, digest, reconstruct


class ReassemblyTests(unittest.TestCase):
    def setUp(self):
        (ROOT / 'private').mkdir(exist_ok=True)
        self.temp = tempfile.TemporaryDirectory(dir=ROOT / 'private')
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.header = b'key\tcount\r\n'
        full = self.header
        parts = []
        for i in range(1, 7):
            body = f'synthetic-{i}\t{i}\r\n'.encode()
            tsv = self.root / f'part-{i}.tsv'; tsv.write_bytes(self.header + body)
            archive = self.root / f'{7-i}-part-{i}.zip'
            with zipfile.ZipFile(archive, 'w') as z: z.write(tsv, tsv.name)
            parts.append(dict(index=i, archive=f'part-{i}.zip', inner_tsv=tsv.name,
                              data_rows=1, archive_bytes=archive.stat().st_size,
                              archive_sha256=digest(archive), tsv_sha256=digest(tsv)))
            full += body
        original = self.root / 'expected.tsv'; original.write_bytes(full)
        self.manifest = dict(source_file='combined.tsv', original_size_bytes=len(full),
                             original_sha256=digest(original), original_header_utf8='key\tcount',
                             data_rows=6, columns=2, parts_count=6, each_part_has_header=True,
                             parts=list(reversed(parts)))
        self.path = self.root / 'MANIFEST.json'

    def run_import(self, manifest=None):
        self.path.write_text(json.dumps(manifest or self.manifest))
        return reconstruct(self.path, self.root, self.root / 'output')

    def test_order_headers_and_exact_bytes(self):
        report = self.run_import()
        self.assertEqual(report['rows'], 6)
        self.assertEqual(report['repeatedHeadersSkipped'], 5)
        self.assertEqual((self.root/'output/combined.tsv').read_bytes(), (self.root/'expected.tsv').read_bytes())
        self.assertEqual(len(list((self.root/'output').glob('part-*.tsv'))), 6)

    def test_bad_original_hash_never_promoted(self):
        self.manifest['original_sha256'] = '0' * 64
        with self.assertRaises(ValueError): self.run_import()
        self.assertFalse((self.root/'output').exists())

    def test_bad_part_rows_or_hash(self):
        for field, value in [('tsv_sha256','0'*64), ('archive_sha256','0'*64), ('data_rows',2)]:
            with self.subTest(field=field):
                manifest = copy.deepcopy(self.manifest); manifest['parts'][0][field] = value
                with self.assertRaises(ValueError): self.run_import(manifest)

    def test_missing_part_and_unsafe_destination(self):
        (self.root/'1-part-6.zip').unlink()
        with self.assertRaises(ValueError): self.run_import()
        with self.assertRaises(ValueError): reconstruct(self.path,self.root,ROOT/'data/leak')

    def test_repeated_header_must_match(self):
        # Re-hash a deliberately changed part to exercise the header check itself.
        part = self.manifest['parts'][0]
        tsv = self.root/part['inner_tsv'];tsv.write_bytes(b'other\tcount\r\nsynthetic-6\t6\r\n')
        archive = self.root/'1-part-6.zip'
        with zipfile.ZipFile(archive,'w') as z:z.write(tsv,tsv.name)
        part.update(archive_bytes=archive.stat().st_size,archive_sha256=digest(archive),tsv_sha256=digest(tsv))
        with self.assertRaises(ValueError):self.run_import()


if __name__ == '__main__':unittest.main()
