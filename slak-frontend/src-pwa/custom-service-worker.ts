/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxMode is set to "injectManifest"
 */

declare const self: ServiceWorkerGlobalScope &
  typeof globalThis & { skipWaiting: () => void };

import { clientsClaim } from 'workbox-core';
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';

import type { Message as WorkerPageVisibilityMessage } from 'src/composables/useSWPageVisibility';
import { getBoolean } from './lib/helpers';

type Message = WorkerPageVisibilityMessage;

const CACHE_NAME = 'slak-v1';

enum CacheKey {
  PageVisibility = 'page-visibility',
}

self.skipWaiting();
clientsClaim();

if (process.env.PROD) {
  precacheAndRoute(self.__WB_MANIFEST);

  registerRoute(
    new NavigationRoute(
      createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
      {
        denylist: [/sw\.js$/, /workbox-(.)*\.js$/],
      }
    )
  );

  cleanupOutdatedCaches();

  registerRoute(
    ({ url }) => url.origin === process.env.API_URL || true,
    async ({ request }) => {
      try {
        const networkResponse = await fetch(request);
        return networkResponse;
      } catch (error) {
        return new Response(null, { status: 503 });
      }
    }
  );
}

// ----- ----- ----- ----- ----- ----- -----

const pushHandler = async (event: PushEvent) => {
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
};

const messageHandler = async (event: ExtendableMessageEvent) => {
  const cache = await caches.open(CACHE_NAME);
  const data = event?.data as Message;

  console.log('[service-worker]:', data);

  switch (data.type) {
    case 'page-visibility':
      const response = new Response(String(data.value));
      cache.put(CacheKey.PageVisibility, response);
      break;
  }
};

self.addEventListener('push', pushHandler);
self.addEventListener('message', messageHandler);
