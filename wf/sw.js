const CACHE = "wf-quick-reference-v22";
const CORE = ["./", "./index.html", "./styles.css", "./app.js", "./content.js", "./model.js"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("wf-quick-reference-") && key !== CACHE).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  const scope = new URL(self.registration.scope);
  // Only the public app shell belongs in this cache.
  const key = CORE.find(path => new URL(path, scope).pathname === url.pathname);
  if (event.request.method !== "GET" || url.origin !== scope.origin || !key) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const html = key === "./" || key === "./index.html";
    try {
      const response = await fetch(event.request);
      const type = response.headers.get("content-type") || "";
      if (response.ok && response.type === "basic" && (html ? type.includes("text/html") : key.endsWith(".js") ? /javascript/.test(type) : type.includes("text/css"))) {
        await cache.put(key, response.clone());
        return response;
      }
      return await cache.match(key) || response;
    } catch {
      return await cache.match(key) || (html ? await cache.match("./index.html") : null) || Response.error();
    }
  })());
});
