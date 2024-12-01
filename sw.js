const CACHE_NAME = "ferks-cache-v1";
const urlsToCache = [
  "/",
  "/style.css",
  "/script.js",
  "/images/icon-192x192.png",
  "/images/icon-512x512.png",
  "/images/menu.png",
  "/images/bag.png",
  // Agrega más archivos que necesites cachear
];

// Instalar el Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Archivos cacheados correctamente");
      return cache.addAll(urlsToCache);
    })
  );
});

// Interceptar solicitudes y servir desde el cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Actualizar el Service Worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

// Manejo de notificaciones push
self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : { title: 'Nueva Notificación', body: 'Tienes un nuevo mensaje.' };
    const options = {
        body: data.body,
        icon: data.icon || '/images/icon-192x192.png',
        badge: data.badge || '/images/badge.png', // Opcional
        data: { url: data.url || '/' } // Datos adicionales, como URL a abrir
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Manejar clics en las notificaciones
self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    const urlToOpen = event.notification.data.url || '/';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            for (const client of clientList) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
