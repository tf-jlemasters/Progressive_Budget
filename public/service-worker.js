const STATIC_CACHE = 'static-cache-v1';
const RUNTIME_CACHE = 'data-cache-v1';
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/index.js',
    '/indexedDB.js',
    '/manifest.webmanifest',
    '/styles.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];
// install 
self.addEventListener('install', event => {

    event.waitUntil(
    caches
        .open(RUNTIME_CACHE)
        .then(cache => cache.add("/api/transaction"))
    );
    event.waitUntil(
    caches
        .open(STATIC_CACHE)
        .then(cache => cache.addAll(FILES_TO_CACHE))
    );
    self.skipWaiting();
});
// activate 
self.addEventListener('activate', event => {
    event.waitUntil(
    caches
        .keys()
        .then(keyList => {
        return Promise.all(
            keyList.map(key => {
            if (key !== STATIC_CACHE && key !== RUNTIME_CACHE) {
                console.log("Old cache data removed");
                return caches.delete(key);
            }
            })
        );
        })
    );

    self.clients.claim()
});
// fetch 
self.addEventListener('fetch', event => {
    if (event.request.url.includes("/api/transaction")) {
    event.respondWith(
        caches
        .open(RUNTIME_CACHE)
        .then(cache => {
            return fetch(event.request)
            // clone if successful
            .then(response => {
                if (response.status === 200) {
                cache.put(event.request.url, response.clone());
                }
                return response;
            })
            .catch(err => cache.match(event.request));
        })
        .catch(err => console.log(err))
    );
    return;
    }
    event.respondWith(
    caches
        .open(STATIC_CACHE)
        .then(cache => {
        return cache
            .match(event.request)
            .then(response => {
            return response || fetch(event.request);
            });
        })
        .catch(err => console.log(err))
    );
});