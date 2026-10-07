/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-7e5eb42b'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "754b7f6cc53c5bdd76635983c1af5ce8"
  }, {
    "url": "pwa-512x512.png",
    "revision": "754b7f6cc53c5bdd76635983c1af5ce8"
  }, {
    "url": "pwa-192x192.png",
    "revision": "0a01b6e7f4116ed4a9807d541f18dd73"
  }, {
    "url": "index.html",
    "revision": "937544a98666e02f48176f8c7b013a43"
  }, {
    "url": "icon.svg",
    "revision": "47f6bfd76797830d78904540c32f515c"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "9a9b0cda17bc57b86d2ed6b3c90efab4"
  }, {
    "url": "app-logo.svg",
    "revision": "77ba59ec8ed6d5f40c7847694d623924"
  }, {
    "url": "assets/web-CiPPh58v.js",
    "revision": null
  }, {
    "url": "assets/index-dHnO_Wpk.css",
    "revision": null
  }, {
    "url": "assets/index-By4gda0K.js",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "9a9b0cda17bc57b86d2ed6b3c90efab4"
  }, {
    "url": "icon.svg",
    "revision": "47f6bfd76797830d78904540c32f515c"
  }, {
    "url": "pwa-192x192.png",
    "revision": "0a01b6e7f4116ed4a9807d541f18dd73"
  }, {
    "url": "pwa-512x512.png",
    "revision": "754b7f6cc53c5bdd76635983c1af5ce8"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "754b7f6cc53c5bdd76635983c1af5ce8"
  }, {
    "url": "manifest.webmanifest",
    "revision": "fa560d79c63e28345f939b0326bd3b05"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
