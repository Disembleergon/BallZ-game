const cacheName = "BallZ-cache-v1";
const ASSETS = [
    "./index.html",
    "./app.js",
    "./style.css"
]

self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(cacheName).then(cache => cache.addAll(ASSETS))
    );

})

self.addEventListener("fetch", event => {

    event.respondWith(
        caches.open(cacheName).then(function (cache) {
          return cache.match(event.request).then(function (response) {
            return (
              response ||
              fetch(event.request).then(function (response) {
                cache.put(event.request, response.clone());
                return response;
              })
            );
          });
        }),
      );

})