// Service Worker for offline support (network-first for JS/CSS to avoid stale bundles)
const CACHE_NAME = "aodup-v3";
const CORE_ASSETS = ["/", "/index.html", "/manifest.webmanifest", "/images/og.png", "/favicon.ico"];

self.addEventListener("message", (event) => {
  if (event?.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Remove old caches to prevent stale JS chunks (can cause React hook/runtime mismatches).
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

function isStaticAsset(request) {
  const url = new URL(request.url);
  return (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "document" ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css")
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Always revalidate favicon (browsers cache it aggressively).
  if (url.pathname === "/favicon.ico") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request, { cache: "reload" });
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, fresh.clone());
          return fresh;
        } catch {
          const cached = await caches.match(request);
          return cached || (await caches.match("/favicon.ico"));
        }
      })(),
    );
    return;
  }

  // Network-first for scripts/styles to avoid stale bundles.
  if (isStaticAsset(request)) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, fresh.clone());
          return fresh;
        } catch {
          const cached = await caches.match(request);
          return cached || (await caches.match("/"));
        }
      })(),
    );
    return;
  }

  // Cache-first for everything else (images, etc.)
  event.respondWith(
    caches.match(request).then((cached) =>
      cached ||
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match("/")),
    ),
  );
});

