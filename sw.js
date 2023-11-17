// install service worker
const cacheName = 'caches-static-v4';
const dynamicCacheName = 'dynamic-cache-v4';
const assets = [
  '/',
  '/index.html',
  '/pages/fallback.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v140/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
];
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(() => limitCacheSize(name, size));
      }
    });
  });
};
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(cacheName).then((cache) => {
      cache.addAll(assets);
    })
  );
});
// activate service worker
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== cacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});
// fetch lifestyle
self.addEventListener('fetch', (evt) => {
  if (evt.request.url.indexOf('firestore.googleapis.com') === -1) {
    evt.respondWith(
      caches
        .match(evt.request)
        .then((cacheRes) => {
          return cacheRes || fetch(evt.request).then(fetchRes => {
           return caches.open(dynamicCacheName).then(cache => {
               cache.put(evt.request.url, fetchRes.clone());
              // check cached items size
                  limitCacheSize(dynamicCacheName, 16);
                  return fetchRes;
            })
           

          })
       
        })
        .catch(() => {
          if (evt.request.url.indexOf('.html') > -1) {
            return caches.match('/pages/fallback.html');
          }
        })
    );
  }
});
