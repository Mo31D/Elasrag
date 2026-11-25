import { readFile, access, readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const experience = resolve(root, 'creation-engine');
const files = (await readdir(resolve(experience, 'src'))).filter(f => f.endsWith('.js'));
let references = 0;
for (const name of files) {
  const path = resolve(experience, 'src', name);
  const source = await readFile(path, 'utf8');
  const syntax = spawnSync(process.execPath, ['--check', path], { encoding: 'utf8' });
  if (syntax.status) throw new Error(syntax.stderr);
  const imports = [...source.matchAll(/(?:from\s*|import\s*\(|new URL\()\s*['"]([^'"]+)['"]/g)];
  for (const [, specifier] of imports) {
    if (specifier === 'three') continue;
    if (!specifier.startsWith('.')) throw new Error(`Unexpected remote module: ${specifier}`);
    await access(resolve(dirname(path), specifier));
    references++;
  }
}
const html = await readFile(resolve(root, 'index.html'), 'utf8');
for (const [, path] of html.matchAll(/(?:src|href)="(creation-engine\/[^"]+)"/g)) {
  await access(resolve(root, path)); references++;
}
if (!html.includes('mailto:mo@elasrag.com') || !html.includes('https://github.com/Mo31D')) throw new Error('Missing contact destination');
await access(resolve(experience, 'vendor/three.module.js'));
console.log(`PASS: ${files.length} source modules parse; ${references} local source and homepage asset references resolve; contact links present.`);
