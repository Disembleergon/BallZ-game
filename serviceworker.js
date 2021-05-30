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

        caches.match(event.request).then(r => {

            return r || fetch(event.request).then(response => {

                caches.open(cacheName).then(cache => {
                    cache.put(event.request, response.clone())
                })
                return response;
            })

        })

    )

})