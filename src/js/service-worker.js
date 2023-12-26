const FETCH_PRIORITY_URLS = ['/','/index.html','/main.css',]

self.addEventListener('install', event => {
    console.log('install');
    
    event.waitUntil(
      caches.open('my-cache').then(cache => {
        return cache.addAll([
          './',
          './index.html',
          './main.css',
        ]);
      })
    );
  });

  self.addEventListener('activate', (event) => {
    console.log('activate');
  });

  async function cachePriorityThenFetch(event){
    const cacheResponse = await caches.match(event.request);

    if(cacheResponse) {
        return cacheResponse;
    }

    let response;

    try {
        response = await fetch(event.request);
    } catch (error) {
        return;
    }

    const cache = await caches.open('my-cache');
    
    cache.put(event.request, response.clone());

    return response;
  }

  async function fetchPriorityThenCache(event){
    let response;

    try {
        response = await fetch(event.request);
    } catch (error) {
        const cacheResponse = await caches.match(event.request);

        if(cacheResponse) {
            return cacheResponse;
        }
        return;
    }

    const cache = await caches.open('my-cache');
    
    cache.put(event.request, response.clone());

    return response;
  }

  self.addEventListener('fetch', (event) => {
    console.log('fetch');

    const url = new URL(event.request.url);

    if(FETCH_PRIORITY_URLS.includes(url.pathname)) {
      event.respondWith(fetchPriorityThenCache(event));

      return;
    }

    event.respondWith(cachePriorityThenFetch(event));
  });