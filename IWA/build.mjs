import { copyFile, mkdir } from 'node:fs/promises';
import { build } from 'esbuild';

await mkdir('dist', { recursive: true });
await Promise.all([
  build({entryPoints: ['src/app.js'], outfile: 'dist/app.js', bundle: true, minify: true, target: 'es2020'}),
  copyFile('src/index.html', 'dist/index.html'),
  copyFile('src/style.css', 'dist/style.css'),
  copyFile('src/backend-config.json', 'dist/backend-config.json')
]);
