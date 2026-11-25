import { cp, readdir, readFile, rm } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
const index = await readFile(new URL('index.html', dist), 'utf8');
if (!index.includes('src="/LakelandRush/assets/') || index.includes('/src/main.tsx')) {
  throw new Error('Expected a built entry with the /LakelandRush/ base path.');
}

const paths = await readdir(dist);
if (paths.some(path => !['index.html', 'assets', 'regions', 'src'].includes(path))) {
  throw new Error('Unexpected root entry in the Pages build.');
}
for (const name of ['assets', 'regions']) {
  const source = new URL(name, dist);
  await readdir(source);
  const target = new URL(name, root);
  await rm(target, { recursive: true, force: true });
  await cp(source, target, { recursive: true });
}
// Optional AI Studio assets already live at src/assets when present.
await cp(new URL('index.html', dist), new URL('index.html', root));
