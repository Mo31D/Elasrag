"""Verify six uploaded ZIPs and reconstruct their TSV privately, byte for byte."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]


def digest(path):
    h = hashlib.sha256()
    with Path(path).open('rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def reconstruct(manifest_path, archive_dir, destination):
    destination = Path(destination).resolve()
    private = (ROOT / 'private').resolve()
    if not destination.is_relative_to(private) or destination == private:
        raise ValueError('Destination must be a new directory inside English/private/')
    if destination.exists():
        raise ValueError('Destination already exists; do not overwrite evidence')
    m = json.loads(Path(manifest_path).read_text())
    parts = sorted(m['parts'], key=lambda p: p['index'])
    if m['parts_count'] != 6 or [p['index'] for p in parts] != list(range(1, 7)):
        raise ValueError('Exactly six unique consecutive part indexes required')
    if not m['each_part_has_header'] or sum(p['data_rows'] for p in parts) != m['data_rows']:
        raise ValueError('Inconsistent manifest rows or headers')
    names = [m['source_file']] + [p['inner_tsv'] for p in parts]
    if len(set(names)) != len(names) or any(Path(n).name != n or '\\' in n for n in names):
        raise ValueError('Unsafe or duplicate member/output name')
    destination.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=destination.parent, prefix='.bnc-verify-') as temp:
        stage = Path(temp)
        total_rows = 0
        report_parts = []
        original_header = None
        with (stage / m['source_file']).open('wb') as combined:
            for part in parts:
                # The attachment service prepends upload numbers, unrelated to part order.
                matches = [p for p in Path(archive_dir).iterdir()
                           if p.name == part['archive'] or p.name.endswith('-' + part['archive'])]
                if len(matches) != 1:
                    raise ValueError(f"Missing or ambiguous archive for part {part['index']}")
                archive = matches[0]
                if archive.stat().st_size != part['archive_bytes'] or digest(archive) != part['archive_sha256']:
                    raise ValueError(f"Archive size/hash mismatch: part {part['index']}")
                with zipfile.ZipFile(archive) as z:
                    if z.namelist() != [part['inner_tsv']]:
                        raise ValueError('Archive must contain exactly the expected TSV member')
                    info = z.getinfo(part['inner_tsv'])
                    if info.file_size > m['original_size_bytes']:
                        raise ValueError('Member exceeds original size')
                    rows = 0
                    h = hashlib.sha256()
                    with z.open(info) as source, (stage / part['inner_tsv']).open('wb') as extracted:
                        header = source.readline()
                        if header.rstrip(b'\r\n').decode('utf-8') != m['original_header_utf8']:
                            raise ValueError('Header differs from manifest')
                        if original_header is None:
                            original_header = header
                            combined.write(header)
                        elif header != original_header:
                            raise ValueError('Repeated header bytes differ')
                        extracted.write(header); h.update(header)
                        for line in source:
                            if line == original_header:
                                raise ValueError('Unexpected header in data rows')
                            if len(line.rstrip(b'\r\n').split(b'\t')) != m['columns']:
                                raise ValueError('Unexpected TSV field count')
                            line.decode('utf-8')
                            extracted.write(line); h.update(line); combined.write(line)
                            rows += 1
                    if rows != part['data_rows'] or h.hexdigest() != part['tsv_sha256']:
                        raise ValueError(f"TSV row count/hash mismatch: part {part['index']}")
                total_rows += rows
                report_parts.append({'index': part['index'], 'rows': rows, 'archiveHashVerified': True,
                                     'tsvHashVerified': True, 'crcVerified': True})
        combined = stage / m['source_file']
        if (total_rows != m['data_rows'] or combined.stat().st_size != m['original_size_bytes']
                or digest(combined) != m['original_sha256']):
            raise ValueError('Reconstructed original row count/size/SHA-256 mismatch')
        report = {'parts': report_parts, 'rows': total_rows, 'bytes': combined.stat().st_size,
                  'sha256': digest(combined), 'repeatedHeadersSkipped': 5,
                  'manifestSha256': digest(manifest_path)}
        (stage / 'integrity-report.json').write_text(json.dumps(report, indent=2) + '\n')
        shutil.copyfile(manifest_path, stage / 'MANIFEST.json')
        stage.rename(destination)
    return report


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--manifest', type=Path, required=True)
    parser.add_argument('--archives', type=Path, required=True)
    parser.add_argument('--destination', type=Path, required=True)
    args = parser.parse_args()
    print(json.dumps(reconstruct(args.manifest, args.archives, args.destination), indent=2))
