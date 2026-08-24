const CACHE_NAME = 'etg-asistencia-v1';
const urlsToCache = [
  '/',
  '/admin.html',
  '/crew.html',
  '/dashboard.html',
  '/config.js',
  '/manifest.json'
];

// Install event - cache files
self.addEventListener('install', event => {
  console.log('Service Worker instalado');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cacheando archivos');
      return cache.addAll(urlsToCache).catch(err => {
        console.log('Algunos archivos no pudieron ser cacheados:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activado');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, then cache
self.addEventListener('fetch', event => {
  // Ignorar requests que no sean GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone la respuesta
        const responseClone = response.clone();
        
        // Cache la respuesta si es exitosa
        if (response.status === 200) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        
        return response;
      })
      .catch(() => {
        // Si falla la red, usar cache
        return caches.match(event.request).then(cachedResponse => {
          return cachedResponse || new Response('Offline - No hay datos en caché', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});
