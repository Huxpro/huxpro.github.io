/* ===========================================================
 * sw.js
 * ===========================================================
 * Copyright 2016 @huxpro
 * Licensed under Apache 2.0 
 * Register service worker.
 * ========================================================== */

const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';
const HOSTNAME_WHITELIST = [
  self.location.hostname,
  "huangxuan.me",
  "yanshuo.io",
  "cdnjs.cloudflare.com"
]


// The Util Function to hack URLs of intercepted requests
const getFixedUrl = (req) => {
  var now = Date.now();
  url = new URL(req.url)

  // 1. fixed http URL
  // Just keep syncing with location.protocol 
  // fetch(httpURL) belongs to active mixed content. 
  // And fetch(httpRequest) is not supported yet.
  url.protocol = self.location.protocol

  // 2. add query for caching-busting.
  // Github Pages served with Cache-Control: max-age=600
  // max-age on mutable content is error-prone, with SW life of bugs can even extend.
  // Until cache mode of Fetch API landed, we have to workaround cache-busting with query string.
  // Cache-Control-Bug: https://bugs.chromium.org/p/chromium/issues/detail?id=453190
  url.search += (url.search ? '&' : '?') + 'cache-bust=' + now;
  return url.href
}

// The Util Function to filter out Navigation Requests.
// request.mode of 'navigate' is unfortunately not supported in Chrome
// versions older than 49, so we need to include a less precise fallback,
// which checks for a GET request with an Accept: text/html header.
const isNavigationReq = (req) => (req.mode === 'navigate' || (req.method === 'GET' && req.headers.get('accept').includes('text/html')))

// Redirect in SW manually fixed github pages 404s on repo?blah 
// if An url is navigation and isnt end with '/' (indicate github would 404s on it )
// it should be a dir request and need to fixed
// P.S. An url.pathname has no '.' cant indicate it's file (e.g. http://test.com/api/version/1.2/)
// https://twitter.com/Huxpro/status/793519812127227905
const shouldRedirect = (req) => (isNavigationReq(req) && req.url.substr(-1) !== "/")

/**
 *  @Lifecycle Install
 *  Precache anything static to this version of your app.
 *  e.g. App Shell, 404, JS/CSS dependencies...
 *
 *  waitUntil() : installing ====> installed
 *  skipWaiting() : waiting(installed) ====> activating
 */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(PRECACHE).then(cache => {
      return cache.add('offline.html')
      .then(self.skipWaiting())
      .catch(err => console.log(err))
    })
  )
});


/**
 *  @Lifecycle Activate
 *  New one activated when old isnt being used.
 *
 *  waitUntil(): activating ====> activated
 */
self.addEventListener('activate',  event => {
  console.log('service worker activated.')
  event.waitUntil(self.clients.claim());
});


/**
 *  @Functional Fetch
 *  All network requests are being intercepted here.
 * 
 *  void respondWith(Promise<Response> r);
 */
self.addEventListener('fetch', event => {
  // logs for debugging
  console.log(`fetch ${event.request.url}`)
  //console.log(` - type: ${event.request.type}; destination: ${event.request.destination}`)
  //console.log(` - mode: ${event.request.mode}, accept: ${event.request.headers.get('accept')}`)

  // Skip some of cross-origin requests, like those for Google Analytics.
  if (HOSTNAME_WHITELIST.indexOf(new URL(event.request.url).hostname) > -1) {
    
    // Redirect in SW manually fixed github pages 404s on repo?blah 
    if(shouldRedirect(event.request)){
      event.respondWith(Response.redirect(`${event.request.url}/`))
      return;
    }

    // Stale-while-revalidate 
    // similar to HTTP's stale-while-revalidate: https://www.mnot.net/blog/2007/12/12/stale
    // Upgrade from Jake's to Surma's: https://gist.github.com/surma/eb441223daaedf880801ad80006389f1
    const cached = caches.match(event.request);
    const fixedUrl = getFixedUrl(event.request);
    const fetched = fetch(fixedUrl, {cache: "no-store"});
    const fetchedCopy = fetched.then(resp => resp.clone());

    // Call respondWith() with whatever we get first.
    // If the fetch fails (e.g disconnected), wait for the cache.
    // If there’s nothing in cache, wait for the fetch. 
    // If neither yields a response, return offline pages.
    event.respondWith(
      Promise.race([fetched.catch(_ => cached), cached])
        .then(resp => resp || fetched)
        .catch(_ => caches.match('offline.html'))
    );

    // Update the cache with the version we fetched (only for ok status)
    event.waitUntil(
      Promise.all([fetchedCopy, caches.open(RUNTIME)])
        .then(([response, cache]) => response.ok && cache.put(event.request, response))
        .catch(_ => {/* eat any errors */})
    );
  }
});
