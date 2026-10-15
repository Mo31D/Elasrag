import { cp, readdir, rm } from 'node:fs/promises';
// Stage only this app's generated files; never touch the parent site.
for (const f of await readdir('../assets'))
  if (/^index-[a-zA-Z0-9_-]+\.(js|css)$/.test(f)) await rm('../assets/' + f);
await cp('dist/index.html', '../index.html');
for (const dir of ['assets', 'audio', 'data'])
  await cp('dist/' + dir, '../' + dir, { recursive: true });
