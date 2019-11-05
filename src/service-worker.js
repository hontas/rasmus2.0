/* eslint-env serviceworker */
/* global workbox */

workbox.core.setCacheNameDetails({ prefix: 'Resmus' });

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
workbox.clientsClaim();
workbox.skipWaiting();
