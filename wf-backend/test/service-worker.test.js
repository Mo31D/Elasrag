import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

test('retirement replaces legacy workers without fetching, caching or reloading open drafts at either address', async () => {
  for (const scope of ['https://mo.elasrag.com/', 'https://www.elasrag.com/wf/']) {
    const listeners = {};
    const steps = [];
    const context = {
      self: {
        registration: { scope, async unregister() { steps.push('unregister'); } },
        clients: { async claim() { steps.push('claim'); } },
        async skipWaiting() { steps.push('skipWaiting'); },
        addEventListener(type, listener) { listeners[type] = listener; },
      },
      caches: {
        async keys() { return ['wf-quick-reference-v19', 'wf-quick-reference-v43', 'other-app']; },
        async delete(key) { steps.push(key); },
        async open() { throw new Error('Retired worker must never cache'); },
      },
    };
    vm.runInNewContext(readFileSync(new URL('../../wf/sw.js', import.meta.url), 'utf8'), context);
    let pending;
    listeners.install({waitUntil(value) { pending = value; }}); await pending;
    listeners.activate({waitUntil(value) { pending = value; }}); await pending;
    assert.deepEqual(steps, ['skipWaiting', 'wf-quick-reference-v19', 'wf-quick-reference-v43', 'claim', 'unregister']);
    assert.equal(listeners.fetch, undefined);
    assert.equal(listeners.message, undefined);
  }
});
