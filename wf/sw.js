const CACHE = "wf-quick-reference-v20";
const CORE = ["./", "./index.html"];

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
  if (event.request.method !== "GET" || url.origin !== scope.origin || ![scope.pathname, scope.pathname + "index.html"].includes(url.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const key = url.pathname === scope.pathname ? "./" : "./index.html";
    try {
      const response = await fetch(event.request);
      if (response.ok && response.type === "basic" && response.headers.get("content-type")?.includes("text/html")) {
        await cache.put(key, response.clone());
        return response;
      }
      return await cache.match(key) || response;
    } catch {
      return await cache.match(key) || await cache.match("./index.html") || Response.error();
    }
  })());
});
