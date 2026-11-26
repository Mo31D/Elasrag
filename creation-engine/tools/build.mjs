import { build } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const runtime=resolve(root,'runtime');
await mkdir(runtime,{recursive:true});
const result=await build({
  entryPoints:[resolve(root,'src/bootstrap.js')], outdir:runtime,
  entryNames:'home-[hash]', bundle:true, format:'esm', platform:'browser',
  target:['es2022'], minify:true, legalComments:'linked', metafile:true,
  alias:{three:resolve(root,'vendor/three.module.js')}, logLevel:'silent',
});
const bundle=Object.keys(result.metafile.outputs).find(path=>path.endsWith('.js'));
const css=await readFile(resolve(root,'style.css'));
const cssName=`style-${createHash('sha256').update(css).digest('hex').slice(0,12)}.css`;
await writeFile(resolve(runtime,cssName),css);
const pagePath=resolve(root,'../index.html');
let page=await readFile(pagePath,'utf8');
page=page.replace(/href="creation-engine\/(?:style\.css|runtime\/style-[\w-]+\.css)"/,`href="creation-engine/runtime/${cssName}"`);
page=page.replace(/src="creation-engine\/(?:src\/bootstrap\.js|runtime\/home-[\w-]+\.js)"/,`src="creation-engine/runtime/${basename(bundle)}"`);
// The production bundle resolves its vendored dependencies at build time.
page=page.replace(/\s*<script type="importmap">[\s\S]*?<\/script>/,'');
await writeFile(pagePath,page);
console.log(`Built ${basename(bundle)} and ${cssName}; editable modules remain in src/.`);
