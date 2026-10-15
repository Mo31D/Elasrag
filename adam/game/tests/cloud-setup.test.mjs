import { test } from 'node:test';
import assert from 'node:assert/strict';
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
      /import config from ["']\.\/cloud-config\.json["'];/,
      'const config=' +
        (await readFile(
          new URL('../src/cloud-config.json', import.meta.url),
          'utf8',
        )) +
        ';',
    )
    .replace(/from ["']\.\/cloud-mission["']/, "from './cloud-mission.mjs'");
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
const { CloudGateway } = await import(new URL('cloud.mjs', temp));
test('verified Adam project configuration accepts only its public client shape', async () => {
  const config = JSON.parse(
    await readFile(
      new URL('../src/cloud-config.json', import.meta.url),
      'utf8',
    ),
  );
  assert.equal(config.enabled, true);
  assert.match(config.projectUrl, /^https:\/\/[a-z0-9-]+\.supabase\.co$/);
  assert.match(config.publishableKey, /^sb_publishable_/);
  assert.doesNotThrow(
    () => new CloudGateway(config.projectUrl, config.publishableKey),
  );
  assert.throws(
    () => new CloudGateway('https://untrusted.test', 'secret'),
    /verified cloud configuration/,
  );
});
