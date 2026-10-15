import { cp, mkdir } from 'node:fs/promises';
// Preserve the previous published hashes so cached HTML can finish loading.
// Build in an isolated dist directory; only copy this app's output to /adam/.
await mkdir('../assets', { recursive: true });
await cp('dist/index.html', '../index.html');
for (const dir of ['assets', 'audio', 'data', 'shared'])
  await cp('dist/' + dir, '../' + dir, { recursive: true });
