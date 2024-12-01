/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxMode is set to "injectManifest"
 */

declare const self: ServiceWorkerGlobalScope &
  typeof globalThis & { skipWaiting: () => void };

import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

import type { Message as WorkerPageVisibilityMessage } from 'composables/useWorkerPageVisibility';
import { getBoolean } from './lib/helpers';

type Message = WorkerPageVisibilityMessage;

self.skipWaiting();
clientsClaim();

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Non-SSR fallback to index.html
// Production SSR fallback to offline.html (except for dev)

// if (process.env.MODE !== 'ssr' || process.env.PROD) {
//   registerRoute(
//     new NavigationRoute(
//       createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
//       { denylist: [/sw\.js$/, /workbox-(.)*\.js$/] }
//     )
//   );
// }

// ----- ----- ----- ----- ----- ----- -----

const CACHE_NAME = 'slak-v1';

enum CacheKey {
  PageVisibility = 'page-visibility',
}

self.addEventListener('push', function (event) {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const response = await cache.match(CacheKey.PageVisibility);
      const isPageVisible = getBoolean(await response?.text());

      const data = event.data?.json();
      if (!data || isPageVisible) return Promise.resolve();

      console.log('[web-push]:', { isPageVisible, data });

      return self.registration.showNotification(data.channelName, {
        body: data.messageContent,
      });
    })()
  );
});

self.addEventListener('message', async (event) => {
  const cache = await caches.open(CACHE_NAME);
  const data = event?.data as Message;

  console.log('[service-worker]:', data);

  switch (data.type) {
    case 'page-visibility':
      const response = new Response(String(data.value));
      cache.put(CacheKey.PageVisibility, response);
      break;
  }
});
