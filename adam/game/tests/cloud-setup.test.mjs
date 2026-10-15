import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';
import ts from 'typescript';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const temp = new URL('../.cloud-test-build/', import.meta.url);
await mkdir(temp, { recursive: true });
for (const file of ['cloud-mission', 'cloud']) {
  let source = await readFile(
    new URL('../src/' + file + '.ts', import.meta.url),
    'utf8',
  );
  source = source
    .replace(
      "import config from './cloud-config.json';",
      'const config=' +
        (await readFile(
          new URL('../src/cloud-config.json', import.meta.url),
          'utf8',
        )) +
        ';',
    )
    .replace("from './cloud-mission'", "from './cloud-mission.mjs'");
  await writeFile(
    new URL(file + '.mjs', temp),
    ts.transpileModule(source, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
      },
    }).outputText,
  );
}
const { openCloudDesk, CloudGateway } = await import(
  new URL('cloud.mjs', temp)
);
test('unverified project configuration leaves cloud disconnected and explains safe setup', async () => {
  const win = new Window();
  globalThis.document = win.document;
  let title = '';
  await openCloudDesk({
    openDialog(t, html) {
      title = t;
      document.body.innerHTML = html;
    },
    closeDialog() {},
    shell() {},
    map() {},
    setView() {},
  });
  assert.equal(title, 'Secure family learning');
  assert.match(document.body.textContent, /Cloud connection is not active/);
  assert.equal(document.querySelector('input[type=password]'), null);
  assert.throws(
    () => new CloudGateway('https://untrusted.test', 'secret'),
    /verified cloud configuration/,
  );
});
