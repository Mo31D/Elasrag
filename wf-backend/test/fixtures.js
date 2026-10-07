import { WFAuthGuard } from '../src/index.js';
export function fixture() {
  const records = new Map();
  const kv = new Map();
  const state = {
    blockConcurrencyWhile: fn => fn(),
    storage: {
      async get(key) { return records.get(key); },
      async put(key, value) { if (typeof key === 'object') Object.entries(key).forEach(([k, v]) => records.set(k, v)); else records.set(key, value); },
      async delete(key) { for (const k of Array.isArray(key) ? key : [key]) records.delete(k); },
      async list() { return records; }, async setAlarm() {},
    },
  };
  const env = {
    WF_PASSWORD: 'fixture-password-only', SESSION_SECRET: 'fixture-signing-key-only',
    WF_DATA: { async get(key) { return kv.has(key) ? JSON.parse(kv.get(key)) : null; }, async put(key, value) { kv.set(key, value); } },
  };
  const guard = new WFAuthGuard(state, env);
  env.WF_AUTH = { idFromName: name => name, get: () => guard };
  return { env, guard, state, records, kv };
}
