importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.4/workbox-sw.js');

var BASE_CACHE_NAME = 'imgclean-v3';
workbox.core.setCacheNameDetails({
    prefix: BASE_CACHE_NAME
});

// Caching frontend code
workbox.routing.registerRoute(
    ({request}) => request.destination === 'script' ||
                   request.destination === 'style',
    new workbox.strategies.StaleWhileRevalidate({
    // new workbox.strategies.CacheFirst({
        // Use a custom cache name.
        cacheName: BASE_CACHE_NAME+'js-css-cache',
      })
);

// Prefer online first, cache fallback
workbox.routing.registerRoute(
  ({url}) => url.pathname.startsWith('/'),
   new workbox.strategies.NetworkFirst({
      // Use a custom cache name.
      cacheName: BASE_CACHE_NAME+'page-cache',
    })
);
