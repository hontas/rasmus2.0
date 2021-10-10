/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

importScripts(
  "/rasmus2.0/precache-manifest.80c2fb1459d16d33ddc00a61e79f4f6b.js"
);

workbox.core.setCacheNameDetails({prefix: "resmus"});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/img/, new workbox.strategies.CacheFirst({ "cacheName":"local-images", plugins: [] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/sheets.googleapis.com\/v4\/spreadsheets\//, new workbox.strategies.NetworkFirst({ "cacheName":"google-sheets-api","networkTimeoutSeconds":10, plugins: [] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/rrp.vasttrafik.se\/img/, new workbox.strategies.CacheFirst({ "cacheName":"vasttrafik-images", plugins: [] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/unpkg.com\/leaflet/, new workbox.strategies.CacheFirst({ "cacheName":"leaflet-assets", plugins: [] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/\w.tile.openstreetmap.org\//, new workbox.strategies.CacheFirst({ "cacheName":"map-images", plugins: [] }), 'GET');
