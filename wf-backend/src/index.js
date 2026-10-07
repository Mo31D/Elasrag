const ALLOWED_ORIGINS = new Set([
  "https://www.elasrag.com",
  "https://elasrag.com",
]);

const encoder = new TextEncoder();

function json(body, status = 200, origin = null, extraHeaders = {}) {
  const headers = new Headers({
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    ...extraHeaders,
  });
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers.set("access-control-allow-origin", origin);
    headers.set("access-control-allow-credentials", "true");
    headers.set("vary", "Origin");
    headers.set("access-control-expose-headers", "etag");
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function corsPreflight(origin) {
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return new Response(null, { status: 403 });
  }
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": origin,
      "access-control-allow-credentials": "true",
      "access-control-allow-methods": "GET,POST,PUT,OPTIONS",
      "access-control-allow-headers": "content-type, if-match",
      "access-control-max-age": "86400",
      "vary": "Origin",
    },
  });
}

function base64url(bytes) {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, c => c.charCodeAt(0));
}

async function sha256(value) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a[i] ^ b[i];
  return result === 0;
}

async function verifyPassword(input, expected) {
  if (!input || !expected) return false;
  const [a, b] = await Promise.all([sha256(input), sha256(expected)]);
  return constantTimeEqual(a, b);
}

async function importHmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function makeSession(secret, nonce) {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12,
    nonce,
  };
  const body = base64url(encoder.encode(JSON.stringify(payload)));
  const key = await importHmacKey(secret);
  const signature = base64url(await crypto.subtle.sign("HMAC", key, encoder.encode(body)));
  return body + "." + signature;
}

async function verifySession(token, secret) {
  if (!token || !secret) return false;
  const [body, signature] = token.split(".");
  if (!body || !signature || token.split(".").length !== 2) return false;

  try {
    const key = await importHmacKey(secret);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64url(signature),
      encoder.encode(body)
    );
    if (!valid) return false;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64url(body)));
    return Number.isInteger(payload.exp) && payload.exp > Math.floor(Date.now() / 1000) && typeof payload.nonce === "string" ? payload : false;
  } catch {
    return false;
  }
}

function cookieValue(request, name) {
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return "";
}

function sessionCookie(token) {
  return [
    "wf_session=" + token,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Path=/",
    "Max-Age=43200",
  ].join("; ");
}

function clearSessionCookie() {
  return "wf_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0";
}

const MAX_BYTES = 100000;
const PROFILE_FIELDS = new Set(["colleagueNumber", "kioskId", "kioskPin", "workPin", "thriveUsername"]);

function validData(data) {
  if (!data || Array.isArray(data) || typeof data !== "object") return false;
  if (Object.keys(data).some(key => !["version", "profile", "items"].includes(key))) return false;
  if (data.version !== 1 || !data.profile || Array.isArray(data.profile) || typeof data.profile !== "object") return false;
  if (Object.entries(data.profile).some(([key, value]) => !PROFILE_FIELDS.has(key) || typeof value !== "string" || value.length > 256)) return false;
  return Array.isArray(data.items) && data.items.length <= 200 && data.items.every(item =>
    item && !Array.isArray(item) && typeof item === "object" &&
    Object.keys(item).every(key => ["label", "value", "note"].includes(key)) &&
    typeof item.label === "string" && item.label.trim().length > 0 && item.label.length <= 200 &&
    typeof item.value === "string" && item.value.trim().length > 0 && item.value.length <= 4096 &&
    typeof item.note === "string" && item.note.length <= 4096);
}

function normalizeData(raw) {
  if (raw == null || (typeof raw === "object" && !Array.isArray(raw) && !Object.keys(raw).length)) {
    return { version: 1, profile: {}, items: [] };
  }
  if (Array.isArray(raw)) raw = { version: 1, profile: {}, items: raw.map(item => ({ ...item, note: item.note || "" })) };
  if (!validData(raw)) throw new Error("Unsupported stored data");
  return raw;
}

async function readJson(request, limit = MAX_BYTES) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    throw Object.assign(new Error(), { status: 415 });
  }
  if (Number(request.headers.get("content-length")) > limit) throw Object.assign(new Error(), { status: 413 });
  const reader = request.body?.getReader();
  if (!reader) throw Object.assign(new Error(), { status: 400 });
  const chunks = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      throw Object.assign(new Error(), { status: 413 });
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  try { return JSON.parse(new TextDecoder().decode(bytes)); }
  catch { throw Object.assign(new Error(), { status: 400 }); }
}

async function revision(data) {
  return '"' + base64url(await sha256(JSON.stringify(data))) + '"';
}

// One coordinator gives immediate session revocation and serializes private writes.
export class WFAuthGuard {
  constructor(state, env) { this.state = state; this.env = env; this.currentData = null; }

  async fetch(request) {
    return this.state.blockConcurrencyWhile(async () => {
      const body = await request.json();
      const now = Date.now();
      const store = this.state.storage;
      if (body.action === "attempt") {
        const key = "attempt:" + body.ip;
        let record = await store.get(key);
        if (!record || record.until <= now) record = { count: 0, until: now + 15 * 60 * 1000 };
        record.count++;
        await store.put(key, record);
        await store.setAlarm(now + 12 * 60 * 60 * 1000);
        return json({ allowed: record.count <= 10 });
      }
      if (body.action === "create") {
        await store.put("session:" + body.nonce, { until: now + 12 * 60 * 60 * 1000 });
        await store.delete("attempt:" + body.ip);
        await store.setAlarm(now + 12 * 60 * 60 * 1000);
        return json({ ok: true });
      }
      if (body.action === "revoke") {
        if (body.nonce) await store.delete("session:" + body.nonce);
        return json({ ok: true });
      }
      const session = await store.get("session:" + body.nonce);
      if (!session || session.until <= now) return json({ authenticated: false }, 401);
      if (body.action === "check") return json({ authenticated: true });
      if (!this.env.WF_DATA) return json({ error: "Unavailable" }, 503);
      if (!this.currentData) {
        const raw = await this.env.WF_DATA.get("private-data", "json");
        // An existing record always takes priority over the legacy secret.
        const data = normalizeData(raw ?? (this.env.WF_PRIVATE_DATA ? JSON.parse(this.env.WF_PRIVATE_DATA) : null));
        const expected = await store.get("private-revision");
        if (expected && expected !== await revision(data)) return json({ error: "Unavailable" }, 503);
        this.currentData = data;
      }
      const etag = await revision(this.currentData);
      if (body.action === "read") return json({ ok: true, data: this.currentData }, 200, null, { etag });
      if (body.action === "write") {
        if (body.etag !== etag) return json({ error: "Conflict" }, 409);
        const lastWrite = await store.get("private-write-time") || 0;
        if (now - lastWrite < 1000) return json({ error: "Try again" }, 429);
        if (!validData(body.data)) return json({ error: "Invalid data" }, 400);
        const nextRevision = await revision(body.data);
        await this.env.WF_DATA.put("private-data", JSON.stringify(body.data));
        await store.put({ "private-revision": nextRevision, "private-write-time": now });
        this.currentData = body.data;
        return json({ ok: true, data: body.data }, 200, null, { etag: nextRevision });
      }
      return json({ error: "Not found" }, 404);
    });
  }

  async alarm() {
    const records = await this.state.storage.list();
    const expired = [];
    let next = Infinity;
    for (const [key, value] of records) {
      if (!key.startsWith("session:") && !key.startsWith("attempt:")) continue;
      if (value.until <= Date.now()) expired.push(key);
      else next = Math.min(next, value.until);
    }
    if (expired.length) await this.state.storage.delete(expired);
    if (Number.isFinite(next)) await this.state.storage.setAlarm(next);
  }
}

async function guard(env, body) {
  const stub = env.WF_AUTH.get(env.WF_AUTH.idFromName("personal"));
  return stub.fetch(new Request("https://internal/", { method: "POST", body: JSON.stringify(body) }));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("origin");
    if (request.method === "OPTIONS") return corsPreflight(origin);
    if (url.pathname === "/health" && request.method === "GET") {
      const ready = Boolean(env.WF_PASSWORD && env.SESSION_SECRET && env.WF_DATA && env.WF_AUTH);
      return json({ ok: ready, service: "wf-backend", version: 2 }, ready ? 200 : 503, origin);
    }
    // CORS alone does not prevent cross-origin writes.
    if (origin && !ALLOWED_ORIGINS.has(origin)) return json({ error: "Forbidden" }, 403);
    if (["POST", "PUT"].includes(request.method) && !ALLOWED_ORIGINS.has(origin)) return json({ error: "Forbidden" }, 403);
    if (!env.WF_PASSWORD || !env.SESSION_SECRET || !env.WF_AUTH) return json({ error: "Unavailable" }, 503, origin);
    try {
      if (url.pathname === "/login" && request.method === "POST") {
        const body = await readJson(request, 4096);
        const ip = base64url(await sha256(request.headers.get("cf-connecting-ip") || "unknown"));
        const attempt = await (await guard(env, { action: "attempt", ip })).json();
        if (!attempt.allowed) return json({ error: "Try again later" }, 429, origin);
        if (typeof body?.password !== "string" || body.password.length > 1024 || !(await verifyPassword(body.password, env.WF_PASSWORD))) {
          return json({ error: "Invalid password" }, 401, origin);
        }
        const nonce = crypto.randomUUID();
        await guard(env, { action: "create", nonce, ip });
        const token = await makeSession(env.SESSION_SECRET, nonce);
        return json({ ok: true }, 200, origin, { "set-cookie": sessionCookie(token) });
      }
      const payload = await verifySession(cookieValue(request, "wf_session"), env.SESSION_SECRET);
      if (url.pathname === "/logout" && request.method === "POST") {
        if (payload) await guard(env, { action: "revoke", nonce: payload.nonce });
        return json({ ok: true }, 200, origin, { "set-cookie": clearSessionCookie() });
      }
      if (url.pathname === "/session" && request.method === "GET") {
        const authenticated = !!payload && (await guard(env, { action: "check", nonce: payload.nonce })).ok;
        return json({ ok: true, authenticated }, 200, origin);
      }
      if (url.pathname === "/private" && ["GET", "PUT"].includes(request.method)) {
        if (!payload) return json({ error: "Unauthorized" }, 401, origin);
        const body = request.method === "PUT" ? await readJson(request) : null;
        if (body && !validData(body)) return json({ error: "Invalid data" }, 400, origin);
        const response = await guard(env, {
          action: request.method === "PUT" ? "write" : "read",
          nonce: payload.nonce, data: body, etag: request.headers.get("if-match"),
        });
        return json(await response.json(), response.status, origin, response.headers.has("etag") ? { etag: response.headers.get("etag") } : {});
      }
      return json({ error: "Not found" }, 404, origin);
    } catch (error) {
      const status = [400, 413, 415].includes(error.status) ? error.status : 503;
      return json({ error: status === 503 ? "Unavailable" : "Invalid request" }, status, origin);
    }
  },
};
