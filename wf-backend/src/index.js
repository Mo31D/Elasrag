import { OWNER_PROFILE, initialCompanion } from "./defaults.js";
import { WF_BUILD } from "../../wf/build.js";
const ALLOWED_ORIGINS = new Set([
  "https://mo.elasrag.com",
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

const API_PATHS = new Set(["/health", "/login", "/register", "/recover", "/session", "/logout", "/private", "/private/changes", "/account/delete"]);
const MAX_BYTES = 100000;
const PROFILE_FIELDS = new Set(["colleagueNumber", "kioskId", "kioskPin", "workPin", "thriveUsername", "displayName", "role", "site", "manager", "managerEmail", "startDate", "shiftDays", "shiftStart", "shiftEnd", "hours", "hourlyRate", "paidBreak", "annualHoliday", "minibusNote", "firstDayTime", "firstDayLocation", "firstDayPostcode"]);

function validData(data) {
  if (!data || Array.isArray(data) || typeof data !== "object") return false;
  if (Object.keys(data).some(key => !["version", "profile", "items", "companion"].includes(key))) return false;
  if (data.version !== 1 || !data.profile || Array.isArray(data.profile) || typeof data.profile !== "object") return false;
  if (Object.entries(data.profile).some(([key, value]) => !PROFILE_FIELDS.has(key) || typeof value !== "string" || value.length > 256)) return false;
  if (data.companion !== undefined && !validCompanion(data.companion)) return false;
  return Array.isArray(data.items) && data.items.length <= 200 && data.items.every(item =>
    item && !Array.isArray(item) && typeof item === "object" &&
    Object.keys(item).every(key => ["label", "value", "note"].includes(key)) &&
    typeof item.label === "string" && item.label.trim().length > 0 && item.label.length <= 200 &&
    typeof item.value === "string" && item.value.trim().length > 0 && item.value.length <= 4096 &&
    typeof item.note === "string" && item.note.length <= 4096);
}

function validCompanion(value) {
  if (!value || typeof value !== "object" || Array.isArray(value) || Object.keys(value).some(key => !["tasks", "courses"].includes(key))) return false;
  if (!Array.isArray(value.tasks) || value.tasks.length > 100 || !Array.isArray(value.courses) || value.courses.length > 100) return false;
  const ids = new Set();
  const validId = id => typeof id === "string" && /^[a-zA-Z0-9-]{1,80}$/.test(id) && !ids.has(id) && !!ids.add(id);
  const validDate = date => typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) && new Date(date).toISOString().slice(0,10) === date;
  if (!value.tasks.every(task => task && !Array.isArray(task) && Object.keys(task).every(key => ["id", "label", "done", "due", "repeat", "reminder", "lastCompleted"].includes(key)) &&
    validId(task.id) && typeof task.label === "string" && task.label.trim() && task.label.length <= 300 && typeof task.done === "boolean" &&
    (task.due === undefined || task.due === "" || validDate(task.due)) &&
    (task.repeat === undefined || ["none", "daily", "weekly", "monthly"].includes(task.repeat)) &&
    (task.reminder === undefined || ["none", "on-day", "day-before"].includes(task.reminder)) &&
    (task.lastCompleted === undefined || task.lastCompleted === "" || validDate(task.lastCompleted)) &&
    (!["daily", "weekly", "monthly"].includes(task.repeat) || validDate(task.due)) &&
    (!["on-day", "day-before"].includes(task.reminder) || validDate(task.due)))) return false;
  return value.courses.every(course => course && Object.keys(course).every(key => ["id", "titleEN", "titleAR", "due", "status", "required"].includes(key)) && validId(course.id) && typeof course.titleEN === "string" && course.titleEN.trim() && course.titleEN.length <= 300 && typeof course.titleAR === "string" && course.titleAR.length <= 300 && ["not-started", "in-progress", "completed"].includes(course.status) && typeof course.required === "boolean" && (course.due === "" || (typeof course.due === "string" && /^\d{4}-\d{2}-\d{2}$/.test(course.due) && !Number.isNaN(Date.parse(course.due)) && new Date(course.due).toISOString().slice(0,10) === course.due)));
}

function username(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

async function passwordHash(password, salt) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  return base64url(await crypto.subtle.deriveBits({ name: "PBKDF2", salt: fromBase64url(salt), iterations: 100000, hash: "SHA-256" }, key, 256));
}

function normalizeData(raw) {
  if (raw == null || (typeof raw === "object" && !Array.isArray(raw) && !Object.keys(raw).length)) {
    return { version: 1, profile: {}, items: [] };
  }
  if (Array.isArray(raw)) raw = { version: 1, profile: {}, items: raw.map(item => ({ ...item, note: item.note || "" })) };
  if (!validData(raw)) throw new Error("Unsupported stored data");
  return raw;
}

function normalizeLegacySecret(encoded) {
  let source;try{source=JSON.parse(encoded);}catch{source={information:encoded};}
  try{return normalizeData(source);}catch{}
  if(!source || Array.isArray(source) || typeof source!=="object" || source.version!==undefined)throw new Error("Unsupported stored data");
  const profile={};const items=[];
  const add=(label,value)=>{const text=typeof value==="string"?value:JSON.stringify(value);if(!text?.trim())return;for(let start=0;start<text.length;start+=4096)items.push({label:(label+(text.length>4096?" ("+(Math.floor(start/4096)+1)+")":"")).slice(0,200),value:text.slice(start,start+4096),note:""});};
  for(const [key,value] of Object.entries(source)){
    if(key==="profile" && value && typeof value==="object" && !Array.isArray(value)){
      for(const [field,entry] of Object.entries(value)){if(PROFILE_FIELDS.has(field) && ["string","number"].includes(typeof entry) && String(entry).length<=256)profile[field]=String(entry);else add("profile."+field,entry);}continue;
    }
    if(PROFILE_FIELDS.has(key) && ["string","number"].includes(typeof value) && String(value).length<=256){profile[key]=String(value);continue;}
    if(key==="items" && Array.isArray(value)){try{const normalized=normalizeData(value);items.push(...normalized.items);continue;}catch{}}
    add(key,value);
  }
  const data={version:1,profile,items};if(!validData(data))throw new Error("Unsupported stored data");return data;
}

function supplementLegacy(data, encoded) {
  if (!encoded) return data;
  let legacy;
  try { legacy = normalizeLegacySecret(encoded); } catch { return data; }
  const profile = { ...data.profile };
  for (const [field, value] of Object.entries(legacy.profile)) {
    if (!profile[field] && value) profile[field] = value;
  }
  const merged = { ...data, profile };
  return validData(merged) && encoder.encode(JSON.stringify(merged)).byteLength <= MAX_BYTES ? merged : data;
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

const RECORD_FIELDS = {
  tasks: new Set(["label", "done", "due", "repeat", "reminder", "lastCompleted"]),
  courses: new Set(["titleEN", "titleAR", "due", "status", "required"]),
};
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

function applyChanges(current, changes) {
  if (!Array.isArray(changes) || !changes.length || changes.length > 100) return { status: 400 };
  const next = structuredClone(current);
  for (const change of changes) {
    if (!change || typeof change !== "object" || Array.isArray(change)) return { status: 400 };
    if (change.section === "profile") {
      if (!PROFILE_FIELDS.has(change.key) || !["string", "object"].includes(typeof change.before) ||
          !["string", "object"].includes(typeof change.after) ||
          (change.before !== null && typeof change.before !== "string") ||
          (change.after !== null && typeof change.after !== "string") ||
          (typeof change.after === "string" && change.after.length > 256)) return { status: 400 };
      const existing = own(next.profile, change.key) ? next.profile[change.key] : null;
      if (existing !== change.before) return { status: 409 };
      if (change.after === null) delete next.profile[change.key];
      else next.profile[change.key] = change.after;
      continue;
    }
    if (change.section === "items") {
      if (change.type === "add" && change.after && typeof change.after === "object") {
        if (next.items.some(item => same(item, change.after))) continue;
        next.items.push(change.after);
        continue;
      }
      if (!["update", "remove"].includes(change.type) || !Number.isInteger(change.index) || change.index < 0 || !change.before || typeof change.before !== "object") return { status: 400 };
      let index = change.index;
      if (!same(next.items[index], change.before)) {
        const matches = next.items.flatMap((item, i) => same(item, change.before) ? [i] : []);
        if (matches.length !== 1) return { status: 409 };
        index = matches[0];
      }
      if (change.type === "remove") next.items.splice(index, 1);
      else if (change.after && typeof change.after === "object") next.items[index] = change.after;
      else return { status: 400 };
      continue;
    }
    if (!RECORD_FIELDS[change.section] || !["add", "update", "remove"].includes(change.type)) return { status: 400 };
    const records = next.companion[change.section];
    if (change.type === "add") {
      if (!change.after || typeof change.after !== "object" || typeof change.after.id !== "string") return { status: 400 };
      if (records.some(item => item.id === change.after.id)) return { status: 409 };
      records.push(change.after);
      continue;
    }
    if (typeof change.id !== "string") return { status: 400 };
    const index = records.findIndex(item => item.id === change.id);
    if (index < 0) return { status: 409 };
    if (change.type === "remove") {
      if (!same(records[index], change.before)) return { status: 409 };
      records.splice(index, 1);
      continue;
    }
    if (!change.fields || typeof change.fields !== "object" || Array.isArray(change.fields) || !Object.keys(change.fields).length) return { status: 400 };
    for (const [key, field] of Object.entries(change.fields)) {
      if (!RECORD_FIELDS[change.section].has(key) || !field || typeof field !== "object" || !own(field, "before") || !own(field, "after")) return { status: 400 };
      const current = own(records[index], key) ? records[index][key] : null;
      if (!same(current, field.before)) return { status: 409 };
      if (field.after === null) delete records[index][key];
      else records[index][key] = field.after;
    }
  }
  return validData(next) && encoder.encode(JSON.stringify(next)).byteLength <= MAX_BYTES ? { data: next } : { status: 400 };
}

// One coordinator gives immediate session revocation and serializes private writes.
export class WFAuthGuard {
  constructor(state, env) { this.state = state; this.env = env; this.currentData = new Map(); this.pendingMigration = new Map(); this.pendingLegacy = new Set(); }

  async fetch(request) {
    return this.state.blockConcurrencyWhile(async () => {
      const body = await request.json();
      const now = Date.now();
      const store = this.state.storage;
      if (body.action === "attempt") {
        const registering = body.kind === "register";
        const key = "attempt:" + (registering ? "register:" + body.ip : body.ip + ":" + body.account);
        let record = await store.get(key);
        if (!record || record.until <= now) record = { count: 0, until: now + (registering ? 60 : 15) * 60 * 1000 };
        record.count++;
        await store.put(key, record);
        await this.scheduleAlarm(now + 12 * 60 * 60 * 1000);
        let globalAllowed = true;
        if (!registering) {
          const globalKey="attempt:global:"+body.ip;
          let global=await store.get(globalKey);
          if (!global || global.until<=now) global={count:0,until:now+15*60*1000};
          global.count++;await store.put(globalKey,global);globalAllowed=global.count<=100;
        }
        return json({ allowed: globalAllowed && record.count <= (registering ? 5 : 10) });
      }
      if (["authenticate", "register", "recover"].includes(body.action)) {
        const name = username(body.username);
        if (body.action === "authenticate" && (!name || name === "owner")) {
          if (!(await verifyPassword(body.password, this.env.WF_PASSWORD))) return json({ error: "Invalid credentials" }, 401);
          return json({ userId: "owner", username: "owner" });
        }
        if (!/^[a-z0-9][a-z0-9._-]{2,39}$/.test(name) || name === "owner") return json({ error: "Invalid account" }, 400);
        const key = "user:" + name;
        const account = await store.get(key);
        if(account && await store.get('deletion:'+account.id))return json({error:'Account unavailable'},401);
        if (body.action === "authenticate") {
          const salt = account?.salt || "MDEyMzQ1Njc4OWFiY2RlZg";
          const hash = await passwordHash(body.password, salt);
          if (!account || !constantTimeEqual(fromBase64url(hash), fromBase64url(account.hash))) return json({ error: "Invalid credentials" }, 401);
          return json({ userId: account.id, username: name });
        }
        if (typeof body.password !== "string" || body.password.length < 2 || body.password.length > 1024) return json({ error: "Password too short" }, 400);
        if (body.action === "register" && account) return json({ error: "Account unavailable" }, 409);
        if (body.action === "recover") {
          if (!account || typeof body.recoveryCode !== "string" || !constantTimeEqual(await sha256(body.recoveryCode), fromBase64url(account.recoveryHash))) return json({ error: "Invalid recovery" }, 401);
          const sessions = await store.list({ prefix: "session:" });
          const keys = [...sessions].filter(([, session]) => session.userId === account.id).map(([sessionKey]) => sessionKey);
          if (keys.length) await store.delete(keys);
        }
        const salt = base64url(crypto.getRandomValues(new Uint8Array(16)));
        const recoveryCode = base64url(crypto.getRandomValues(new Uint8Array(24)));
        const userId = account?.id || crypto.randomUUID();
        await store.put(key, { id: userId, username: name, salt, hash: await passwordHash(body.password, salt), recoveryHash: base64url(await sha256(recoveryCode)) });
        return json({ userId, username: name, recoveryCode });
      }
      if (body.action === "create") {
        if(body.userId!=='owner'){
          const user=await store.get('user:'+body.username);
          if(!user || user.id!==body.userId || await store.get('deletion:'+body.userId))return json({error:'Unauthorized'},401);
        }
        await store.put("session:" + body.nonce, { until: now + 12 * 60 * 60 * 1000, userId: body.userId, username: body.username });
        await store.delete("attempt:" + body.ip + ":" + body.username);
        await this.scheduleAlarm(now + 12 * 60 * 60 * 1000);
        return json({ ok: true });
      }
      if (body.action === "revoke") {
        if (body.nonce) await store.delete("session:" + body.nonce);
        return json({ ok: true });
      }
      const session = await store.get("session:" + body.nonce);
      if (!session || session.until <= now) return json({ authenticated: false }, 401);
      const userId = session.userId || "owner";
      if(userId!=='owner'){
        const user=await store.get('user:'+session.username);
        if(!user || user.id!==userId || await store.get('deletion:'+userId))return json({authenticated:false},401);
      }
      if (body.action === "check") return json({ authenticated: true, account: { id: userId, username: session.username || "owner" } });
      if(body.action==='deleteAccount'){
        if(userId==='owner')return json({error:'Unavailable for owner'},403);
        if(!this.env.WF_DATA)return json({error:'Unavailable'},503);
        if(username(body.confirmation)!==session.username || typeof body.password!=='string' || body.password.length>1024)return json({error:'Invalid confirmation'},400);
        const user=await store.get('user:'+session.username);
        const hash=await passwordHash(body.password,user.salt);
        if(!constantTimeEqual(fromBase64url(hash),fromBase64url(user.hash)))return json({error:'Invalid credentials'},401);
        await store.put('deletion:'+userId,{username:session.username,nextAttempt:now+60000});
        await this.scheduleAlarm(now+60000);
        try{await this.purgeAccount(userId,session.username);}catch{}
        return json({ok:true});
      }
      if (!this.env.WF_DATA) return json({ error: "Unavailable" }, 503);
      const dataKey = userId === "owner" ? "private-data" : "private:" + userId;
      const revisionKey = userId === "owner" ? "private-revision" : "private-revision:" + userId;
      const writeTimeKey = userId === "owner" ? "private-write-time" : "private-write-time:" + userId;
      if (!this.currentData.has(userId)) {
        const raw = await this.env.WF_DATA.get(dataKey, "json");
        const legacyPending = userId === "owner" && Boolean(this.env.WF_PRIVATE_DATA) && !(await store.get("private-legacy-merged"));
        let data = raw == null && userId === "owner" && this.env.WF_PRIVATE_DATA ? normalizeLegacySecret(this.env.WF_PRIVATE_DATA) : normalizeData(raw);
        const expected = await store.get(revisionKey);
        if (expected && expected !== await revision(data)) return json({ error: "Unavailable" }, 503);
        if (raw != null && legacyPending) data = supplementLegacy(data, this.env.WF_PRIVATE_DATA);
        if (!data.companion) {
          data = { ...data, profile: userId === "owner" ? { ...OWNER_PROFILE, ...data.profile } : data.profile, companion: initialCompanion(userId === "owner") };
        }
        if (raw == null) {
          await this.env.WF_DATA.put(dataKey, JSON.stringify(data));
          await store.put({ [revisionKey]: await revision(data), [writeTimeKey]: Date.now() });
          if (legacyPending) await store.put("private-legacy-merged", true);
        } else {
          if (!same(raw, data)) this.pendingMigration.set(userId, raw);
          if (legacyPending) this.pendingLegacy.add(userId);
        }
        this.currentData.set(userId, data);
      }
      const current = this.currentData.get(userId);
      const etag = await revision(current);
      const preserveOriginal = async () => {
        const original = this.pendingMigration.get(userId);
        if (original == null) return;
        const backupKey = "private-backup:" + base64url(await sha256(JSON.stringify(original)));
        if (await this.env.WF_DATA.get(backupKey) == null) await this.env.WF_DATA.put(backupKey, JSON.stringify(original));
      };
      const migrationSaved = () => {
        this.pendingMigration.delete(userId);
        this.pendingLegacy.delete(userId);
      };
      if (body.action === "read") return json({ ok: true, data: current }, 200, null, { etag });
      if (body.action === "change") {
        const applied = applyChanges(current, body.changes);
        if (applied.status) return json({ error: applied.status === 409 ? "The edited value changed" : "Invalid data", code: applied.status === 409 ? "edit_conflict" : "invalid_change" }, applied.status);
        const next = applied.data;
        if (same(next, current)) return json({ ok: true, data: current }, 200, null, { etag });
        const nextRevision = await revision(next);
        await preserveOriginal();
        await this.env.WF_DATA.put(dataKey, JSON.stringify(next));
        await store.put(revisionKey, nextRevision);
        if (this.pendingLegacy.has(userId)) await store.put("private-legacy-merged", true);
        migrationSaved();
        this.currentData.set(userId, next);
        return json({ ok: true, data: next }, 200, null, { etag: nextRevision });
      }
      if (body.action === "write") {
        if (body.etag !== etag) return json({ error: "The stored data changed", code: "snapshot_conflict" }, 409);
        const lastWrite = await store.get(writeTimeKey) || 0;
        if (now - lastWrite < 1000) return json({ error: "Try again" }, 429);
        if (!validData(body.data)) return json({ error: "Invalid data" }, 400);
        const next = body.data.companion ? body.data : { ...body.data, profile: { ...current.profile, ...body.data.profile }, companion: current.companion };
        const nextRevision = await revision(next);
        await preserveOriginal();
        await this.env.WF_DATA.put(dataKey, JSON.stringify(next));
        await store.put({ [revisionKey]: nextRevision, [writeTimeKey]: now });
        if (this.pendingLegacy.has(userId)) await store.put("private-legacy-merged", true);
        migrationSaved();
        this.currentData.set(userId, next);
        return json({ ok: true, data: next }, 200, null, { etag: nextRevision });
      }
      return json({ error: "Not found" }, 404);
    });
  }

  async scheduleAlarm(time) {
    const jobs=await this.state.storage.list({prefix:'deletion:'});
    for(const [key,job] of jobs)if(key.startsWith('deletion:'))time=Math.min(time,job.nextAttempt || Date.now()+60000);
    await this.state.storage.setAlarm(time);
  }

  async purgeAccount(userId, name) {
    const store=this.state.storage;
    const user=await store.get('user:'+name);
    if(user?.id===userId)await store.delete('user:'+name);
    const sessions=await store.list({prefix:'session:'});
    const keys=[...sessions].filter(([key,value])=>key.startsWith('session:') && value.userId===userId).map(([key])=>key);
    keys.push('private-revision:'+userId,'private-write-time:'+userId);
    await store.delete(keys);
    this.currentData.delete(userId);this.pendingMigration.delete(userId);this.pendingLegacy.delete(userId);
    await this.env.WF_DATA.delete('private:'+userId);
    await store.delete('deletion:'+userId);
  }

  async alarm() {
    return this.state.blockConcurrencyWhile(async()=>{
    const records = await this.state.storage.list();
    const expired = [];
    let next = Infinity;
    for (const [key, value] of records) {
      if(key.startsWith('deletion:')){
        try{await this.purgeAccount(key.slice(9),value.username);}catch{
          const nextAttempt=Date.now()+60000;await this.state.storage.put(key,{...value,nextAttempt});next=Math.min(next,nextAttempt);
        }
        continue;
      }
      if (!key.startsWith("session:") && !key.startsWith("attempt:")) continue;
      if (value.until <= Date.now()) expired.push(key);
      else next = Math.min(next, value.until);
    }
    if (expired.length) await this.state.storage.delete(expired);
    if (Number.isFinite(next)) await this.state.storage.setAlarm(next);
    });
  }
}

async function guard(env, body) {
  const stub = env.WF_AUTH.get(env.WF_AUTH.idFromName("personal"));
  return stub.fetch(new Request("https://internal/", { method: "POST", body: JSON.stringify(body) }));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if(url.protocol==="http:"){url.protocol="https:";return Response.redirect(url.href,308);}
    const origin = request.headers.get("origin");
    if (["GET", "HEAD"].includes(request.method) && ["/", "/index.html", "/sw.js", "/content.js", "/app.js", "/model.js", "/build.js", "/styles.css", "/WF-Training-Reference.md"].includes(url.pathname)) {
      if (!env.ASSETS) return new Response("Service unavailable", { status: 503, headers: { "cache-control": "no-store" } });
      try {
        const assetUrl = new URL(request.url);
        if (assetUrl.pathname === "/") assetUrl.pathname = "/index.html";
        const assetRequest = new Request(assetUrl, request);
        assetRequest.headers.delete("if-none-match");
        assetRequest.headers.delete("if-modified-since");
        const response = await env.ASSETS.fetch(assetRequest);
        const headers = new Headers(response.headers);
        headers.set("cache-control", "no-store");
        headers.set("cdn-cache-control", "no-store");
        headers.set("cloudflare-cdn-cache-control", "no-store");
        headers.set("strict-transport-security", "max-age=31536000");
        headers.set("x-wf-build", WF_BUILD);
        headers.set("x-content-type-options", "nosniff");
        headers.set("referrer-policy", "same-origin");
        headers.set("x-frame-options", "DENY");
        if (url.pathname === "/WF-Training-Reference.md") {
          headers.set("content-type", "text/markdown; charset=utf-8");
          headers.set("content-disposition", 'attachment; filename="WF-Training-Reference.md"');
        }
        return new Response(response.body, { status: response.status, headers });
      } catch {
        return new Response("Service unavailable", { status: 503, headers: { "cache-control": "no-store" } });
      }
    }
    if (["GET", "HEAD"].includes(request.method) && ["/wf", "/wf/", "/wf/index.html"].includes(url.pathname)) {
      return Response.redirect(url.origin + "/" + url.search, 308);
    }
    const apiPath = url.pathname.startsWith("/api/") ? url.pathname.slice(4) : url.pathname;
    if (!API_PATHS.has(apiPath)) return json({ error: "Not found" }, 404, origin);
    if (request.method === "OPTIONS") return corsPreflight(origin);
    if (apiPath === "/health" && request.method === "GET") {
      const ready = Boolean(env.WF_PASSWORD && env.SESSION_SECRET && env.WF_DATA && env.WF_AUTH && env.ASSETS);
      return json({ ok: ready, service: "wf-backend", version: 6 }, ready ? 200 : 503, origin);
    }
    // CORS alone does not prevent cross-origin writes.
    if (origin && !ALLOWED_ORIGINS.has(origin)) return json({ error: "Forbidden" }, 403);
    if (["POST", "PUT"].includes(request.method) && !ALLOWED_ORIGINS.has(origin)) return json({ error: "Forbidden" }, 403);
    if (!env.WF_PASSWORD || !env.SESSION_SECRET || !env.WF_AUTH) return json({ error: "Unavailable" }, 503, origin);
    try {
      if (["/login", "/register", "/recover"].includes(apiPath) && request.method === "POST") {
        const body = await readJson(request, 4096);
        if (typeof body?.password !== "string" || body.password.length > 1024) return json({ error: "Invalid credentials" }, 400, origin);
        const ip = base64url(await sha256(request.headers.get("cf-connecting-ip") || "unknown"));
        const attempt = await (await guard(env, { action: "attempt", ip, kind: apiPath === "/register" ? "register" : "login", account: username(body.username) || "owner" })).json();
        if (!attempt.allowed) return json({ error: "Try again later" }, 429, origin);
        const result = await guard(env, { action: apiPath === "/login" ? "authenticate" : apiPath === "/register" ? "register" : "recover", username: body.username, password: body.password, recoveryCode: body.recoveryCode });
        const identity = await result.json();
        if (!result.ok) return json(identity, result.status, origin);
        const nonce = crypto.randomUUID();
        const created=await guard(env, { action: "create", nonce, ip, userId: identity.userId, username: identity.username });
        if(!created.ok)return json({error:'Unauthorized'},created.status,origin);
        const token = await makeSession(env.SESSION_SECRET, nonce);
        return json({ ok: true, ...(identity.recoveryCode ? { recoveryCode: identity.recoveryCode } : {}) }, 200, origin, { "set-cookie": sessionCookie(token) });
      }
      const payload = await verifySession(cookieValue(request, "wf_session"), env.SESSION_SECRET);
      if (apiPath === "/logout" && request.method === "POST") {
        if (payload) await guard(env, { action: "revoke", nonce: payload.nonce });
        return json({ ok: true }, 200, origin, { "set-cookie": clearSessionCookie() });
      }
      if (apiPath === "/session" && request.method === "GET") {
        if (!payload) return json({ ok: true, authenticated: false }, 200, origin);
        const result = await guard(env, { action: "check", nonce: payload.nonce });
        return json({ ok: true, ...(await result.json()) }, 200, origin);
      }
      if (apiPath === "/private" && ["GET", "PUT"].includes(request.method)) {
        if (!payload) return json({ error: "Unauthorized" }, 401, origin);
        const body = request.method === "PUT" ? await readJson(request) : null;
        if (body && !validData(body)) return json({ error: "Invalid data" }, 400, origin);
        const response = await guard(env, {
          action: request.method === "PUT" ? "write" : "read",
          nonce: payload.nonce, data: body, etag: request.headers.get("if-match"),
        });
        return json(await response.json(), response.status, origin, response.headers.has("etag") ? { etag: response.headers.get("etag") } : {});
      }
      if (apiPath === "/private/changes" && request.method === "POST") {
        if (!payload) return json({ error: "Unauthorized" }, 401, origin);
        const body = await readJson(request);
        const response = await guard(env, { action: "change", nonce: payload.nonce, changes: body?.changes });
        return json(await response.json(), response.status, origin, response.headers.has("etag") ? { etag: response.headers.get("etag") } : {});
      }
      if(apiPath==='/account/delete' && request.method==='POST'){
        if(!payload)return json({error:'Unauthorized'},401,origin);
        const current=await guard(env,{action:'check',nonce:payload.nonce});
        if(!current.ok)return json({error:'Unauthorized'},401,origin);
        const identity=await current.json();
        if(identity.account.id==='owner')return json({error:'Unavailable for owner'},403,origin);
        const body=await readJson(request,4096);
        const ip=base64url(await sha256(request.headers.get('cf-connecting-ip') || 'unknown'));
        const attempt=await (await guard(env,{action:'attempt',ip,kind:'login',account:identity.account.username})).json();
        if(!attempt.allowed)return json({error:'Try again later'},429,origin);
        const response=await guard(env,{action:'deleteAccount',nonce:payload.nonce,password:body?.password,confirmation:body?.confirmation});
        return json(await response.json(),response.status,origin,response.ok?{'set-cookie':clearSessionCookie()}:{});
      }
      return json({ error: "Not found" }, 404, origin);
    } catch (error) {
      const status = [400, 413, 415].includes(error.status) ? error.status : 503;
      return json({ error: status === 503 ? "Unavailable" : "Invalid request" }, status, origin);
    }
  },
};
