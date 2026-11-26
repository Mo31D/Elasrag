#!/usr/bin/env node
/** Verify the homepage change cannot silently overwrite any existing project. */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { existsSync } from 'node:fs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const BASE = '88277c7b170d41c164e7338659bf018d4653917a';
const run = promisify(execFile);
const git = async (...args) => (await run('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 })).stdout;
const allowed = path => path === 'index.html' || path.startsWith('creation-engine/');
const records = (await git('ls-tree', '-r', '-z', BASE)).split('\0').filter(Boolean);
const failures = [];
let protectedCount = 0;
for (const record of records) {
  const [metadata, path] = record.split('\t');
  if (allowed(path)) continue;
  protectedCount++;
  const expected = metadata.split(' ')[2];
  if (!existsSync(resolve(root, path))) { failures.push(`Deleted: ${path}`); continue; }
  const actual = (await git('hash-object', '--', path)).trim();
  if (actual !== expected) failures.push(`Changed: ${path}`);
}
const additions = (await git('ls-files', '--others', '--exclude-standard', '-z')).split('\0').filter(Boolean);
const trackedAdditions = (await git('diff', '--name-only', '--diff-filter=A', BASE, '--')).trim().split('\n').filter(Boolean);
for (const path of new Set([...additions, ...trackedAdditions])) {
  if (!allowed(path)) failures.push(`Added outside scope: ${path}`);
}
const backup = 'creation-engine/docs/homepage-before.html';
if (!existsSync(resolve(root, backup))) failures.push('Missing recoverable original homepage');
else {
  const original = (await git('rev-parse', `${BASE}:index.html`)).trim();
  if ((await git('hash-object', '--', backup)).trim() !== original) failures.push('Homepage backup differs from original');
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`PASS: ${protectedCount} original files unchanged; original homepage backup verified; additions limited to homepage experience.`);
}
