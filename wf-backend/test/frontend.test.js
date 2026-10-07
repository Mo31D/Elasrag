import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import { JSDOM, VirtualConsole } from 'jsdom';
import worker from '../src/index.js';
import { fixture } from './fixtures.js';
const html = readFileSync(new URL('../../wf/index.html', import.meta.url), 'utf8');

function device(env, hash = '', legacy = null) {
  let cookie = '';
  let unavailable = false;
  const errors = [];
  const console = new VirtualConsole();
  console.on('jsdomError', error => errors.push(error));
  const dom = new JSDOM(html, {
    url: 'https://www.elasrag.com/wf/' + hash, runScripts: 'dangerously', virtualConsole: console,
    beforeParse(window) {
      Object.defineProperty(window, 'crypto', { value: webcrypto });
      window.TextEncoder = TextEncoder; window.TextDecoder = TextDecoder;
      window.AbortController = AbortController;
      window.scrollTo = () => {}; window.confirm = () => true;
      window.navigator.clipboard = { writeText: async () => {} };
      window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
      window.HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new window.Event('close')); };
      if (legacy) Object.entries(legacy).forEach(([key, value]) => window.localStorage.setItem(key, value));
      window.fetch = async (url, options) => {
        assert.equal(options.credentials, 'include'); assert.equal(options.cache, 'no-store');
        if (unavailable) throw new Error('offline fixture');
        const request = new Request(url, { ...options, headers: { ...options.headers, origin: 'https://www.elasrag.com', ...(cookie ? { cookie } : {}) } });
        const response = await worker.fetch(request, env);
        const nextCookie = response.headers.get('set-cookie');
        if (nextCookie) cookie = nextCookie.split(';')[0];
        return response;
      };
    },
  });
  return { dom, window: dom.window, document: dom.window.document, errors, offline: value => unavailable = value };
}
async function until(fn) {
  const start = Date.now();
  while (!fn()) { if (Date.now() - start > 3000) throw new Error('Timed out'); await new Promise(resolve => setTimeout(resolve, 10)); }
}
const click = (d, selector) => d.document.querySelector(selector).click();
const fill = (d, id, value) => d.document.getElementById(id).value = value;
const active = (d, id) => d.document.getElementById(id).classList.contains('active');
async function signIn(d) {
  await until(() => !d.document.getElementById('lockScreen').classList.contains('hidden'));
  fill(d, 'passInput', 'fixture-password-only'); click(d, '#unlockBtn');
  await until(() => d.document.getElementById('lockScreen').classList.contains('hidden'));
}

test('public access, protected direct routes, translated auth, vault CRUD, another device, XSS and offline failure', async t => {
  const { env, records } = fixture();
  const a = device(env); const b = device(env, '#vault');
  t.after(() => { a.window.close(); b.window.close(); });
  assert.equal(a.document.documentElement.dir, 'rtl');
  assert.equal(a.document.getElementById('setupMode'), null);
  for (const page of ['fire', 'training', 'benefits', 'uniform', 'access', 'home']) {
    click(a, `[data-page="${page}"]`);
    assert.ok(active(a, page));
    assert.ok(a.document.getElementById('lockScreen').classList.contains('hidden'));
  }
  click(a, '[data-page="details"]');
  await until(() => !a.document.getElementById('lockScreen').classList.contains('hidden'));
  fill(a, 'passInput', 'wrong'); click(a, '#unlockBtn');
  await until(() => a.document.getElementById('unlockError').textContent.length > 0);
  assert.match(a.document.getElementById('unlockError').textContent, /كلمة/);
  click(a, '[data-lang="en"]');
  assert.equal(a.document.documentElement.dir, 'ltr');
  assert.equal(a.document.getElementById('unlockError').textContent, 'Incorrect password.');
  await signIn(a);
  assert.ok(active(a, 'details'));
  click(a, '[data-page="vault"]'); await until(() => active(a, 'vault'));
  click(a, '#addSecretBtn'); fill(a, 'secretLabel', '<img src=x onerror=alert(1)>'); fill(a, 'secretValue', 'fixture-entry'); click(a, '#saveSecret');
  await until(() => a.document.querySelectorAll('.vault-item').length === 1);
  assert.equal(a.document.querySelectorAll('#vaultList img').length, 0);
  await signIn(b); assert.ok(active(b, 'vault'));
  assert.equal(b.document.querySelector('.secret').textContent, 'fixture-entry');
  click(a, '.mini-actions button:nth-child(3)'); fill(a, 'secretValue', 'edited');
  await new Promise(resolve => setTimeout(resolve, 1005)); click(a, '#saveSecret');
  await until(() => a.document.querySelector('.secret').textContent === 'edited');
  click(a, '#editProfileBtn'); fill(a, 'profile-colleagueNumber', 'fixture-account');
  await new Promise(resolve => setTimeout(resolve, 1005)); click(a, '#saveProfile');
  await until(() => !a.document.getElementById('profileDialog').open);
  click(a, '[data-page="details"]'); await until(() => active(a, 'details'));
  assert.equal(a.document.querySelector('[data-private="colleagueNumber"]').textContent, 'fixture-account');
  click(a, '[data-page="vault"]'); await until(() => active(a, 'vault'));
  await new Promise(resolve => setTimeout(resolve, 1005)); click(a, '.mini-actions button:last-child');
  await until(() => a.document.querySelectorAll('.vault-item').length === 0);
  click(a, '#logoutBtn');
  await until(() => active(a, 'home') && a.document.getElementById('vaultList').textContent === '');
  click(a, '[data-page="details"]');
  await until(() => !a.document.getElementById('lockScreen').classList.contains('hidden'));
  assert.equal(a.document.querySelector('[data-private="colleagueNumber"]').textContent, '');
  a.offline(true); fill(a, 'passInput', 'fixture-password-only'); click(a, '#unlockBtn');
  await until(() => /Unable/.test(a.document.getElementById('unlockError').textContent));
  click(a, '.private-cancel'); click(a, '[data-page="fire"]'); assert.ok(active(a, 'fire'));
  assert.ok(records.size > 0);
  assert.deepEqual(a.errors, []); assert.deepEqual(b.errors, []);
});

test('encrypted legacy import is verified centrally, repeat import deduplicates and old storage remains', async t => {
  const { env, kv } = fixture();
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const base = await webcrypto.subtle.importKey('raw', new TextEncoder().encode('old-fixture-password'), 'PBKDF2', false, ['deriveKey']);
  const key = await webcrypto.subtle.deriveKey({ name:'PBKDF2', salt, iterations:250000, hash:'SHA-256' }, base, { name:'AES-GCM', length:256 }, false, ['encrypt']);
  const b64 = data => Buffer.from(data).toString('base64');
  const encrypt = async text => {
    const iv = webcrypto.getRandomValues(new Uint8Array(12));
    return { iv:b64(iv), data:b64(await webcrypto.subtle.encrypt({ name:'AES-GCM', iv }, key, new TextEncoder().encode(text))) };
  };
  const legacy = {
    'wf-vault-meta-v1': JSON.stringify({ salt:b64(salt), verifier:await encrypt('wf-ok-v1') }),
    'wf-vault-data-v1': JSON.stringify(await encrypt(JSON.stringify([{label:'Old entry', value:'old-value', note:''}]))),
  };
  const d = device(env, '#vault', legacy); t.after(() => d.window.close());
  await signIn(d);
  click(d, '#importLegacyBtn'); fill(d, 'oldPass', 'wrong'); click(d, '#migrateVault');
  await until(() => d.document.getElementById('migrationError').textContent.length > 0);
  fill(d, 'oldPass', 'old-fixture-password'); click(d, '#migrateVault');
  await until(() => d.document.querySelectorAll('.vault-item').length === 1);
  assert.equal(JSON.parse(kv.get('private-data')).items.length, 1);
  assert.equal(d.window.localStorage.getItem('wf-vault-data-v1'), legacy['wf-vault-data-v1']);
  assert.equal(d.window.localStorage.getItem('wf-vault-meta-v1'), legacy['wf-vault-meta-v1']);
  click(d, '#importLegacyBtn'); fill(d, 'oldPass', 'old-fixture-password');
  await new Promise(resolve => setTimeout(resolve, 1005)); click(d, '#migrateVault');
  await until(() => !d.document.getElementById('migrationDialog').open);
  assert.equal(JSON.parse(kv.get('private-data')).items.length, 1);
  assert.deepEqual(d.errors, []);
});
