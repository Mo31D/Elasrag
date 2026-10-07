const ALLOWED_ORIGINS = new Set([
  "https://www.elasrag.com",
  "https://elasrag.com",
]);

const encoder = new TextEncoder();

function json(body, status = 200, origin = null, extraHeaders = {}) {
  const headers = new Headers({
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    ...extraHeaders,
  });
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers.set("access-control-allow-origin", origin);
    headers.set("access-control-allow-credentials", "true");
    headers.set("vary", "Origin");
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
      "access-control-allow-headers": "content-type",
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

async function makeSession(secret) {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12,
    nonce: crypto.randomUUID(),
  };
  const body = base64url(encoder.encode(JSON.stringify(payload)));
  const key = await importHmacKey(secret);
  const signature = base64url(await crypto.subtle.sign("HMAC", key, encoder.encode(body)));
  return body + "." + signature;
}

async function verifySession(token, secret) {
  if (!token || !secret) return false;
  const [body, signature] = token.split(".");
  if (!body || !signature) return false;

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
    return Number(payload.exp) > Math.floor(Date.now() / 1000);
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

async function requireSession(request, env) {
  const token = cookieValue(request, "wf_session");
  return verifySession(token, env.SESSION_SECRET);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("origin");

    if (request.method === "OPTIONS") return corsPreflight(origin);

    if (url.pathname === "/health" && request.method === "GET") {
      return json({ ok: true, service: "wf-backend" }, 200, origin);
    }

    if (url.pathname === "/login" && request.method === "POST") {
      if (!env.WF_PASSWORD || !env.SESSION_SECRET) {
        return json({ ok: false, error: "Backend not configured" }, 503, origin);
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "Invalid request" }, 400, origin);
      }

      const valid = await verifyPassword(String(body?.password || ""), env.WF_PASSWORD);
      if (!valid) return json({ ok: false, error: "Invalid password" }, 401, origin);

      const token = await makeSession(env.SESSION_SECRET);
      return json(
        { ok: true },
        200,
        origin,
        { "set-cookie": sessionCookie(token) }
      );
    }

    if (url.pathname === "/session" && request.method === "GET") {
      const authenticated = await requireSession(request, env);
      return json({ ok: true, authenticated }, 200, origin);
    }

    if (url.pathname === "/private" && request.method === "GET") {
      if (!(await requireSession(request, env))) {
        return json({ ok: false, error: "Unauthorized" }, 401, origin);
      }
      if (!env.WF_DATA) {
        return json({ ok: false, error: "KV storage not configured" }, 503, origin);
      }

      let data = await env.WF_DATA.get("private-data", "json");
      if (data == null) data = {};
      return json({ ok: true, data }, 200, origin);
    }

    if (url.pathname === "/private" && request.method === "PUT") {
      if (!(await requireSession(request, env))) {
        return json({ ok: false, error: "Unauthorized" }, 401, origin);
      }
      if (!env.WF_DATA) {
        return json({ ok: false, error: "KV storage not configured" }, 503, origin);
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "Invalid JSON" }, 400, origin);
      }

      const encoded = JSON.stringify(body ?? {});
      if (encoded.length > 100000) {
        return json({ ok: false, error: "Private data too large" }, 413, origin);
      }

      await env.WF_DATA.put("private-data", encoded);
      return json({ ok: true }, 200, origin);
    }

    if (url.pathname === "/logout" && request.method === "POST") {
      return json(
        { ok: true },
        200,
        origin,
        { "set-cookie": clearSessionCookie() }
      );
    }

    return json({ ok: false, error: "Not found" }, 404, origin);
  },
};
