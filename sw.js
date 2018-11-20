self.addEventListener('install', e => {
    // Adicionar el app shell (Lo que se necesita para que la pagina cargue bien.)
    const cp = caches.open('cache-1')
        .then(cache => {
            return cache.addAll([
                /*Se usa / para que no falle al llamar localhost:8080/*/
                '/',
                '/index.html', 
                '/css/style.css', 
                '/img/main.jpg', 
                'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
                '/js/app.js'
            ]);
        });

    // Esperar hasta que cp termine.
    e.waitUntil(cp);
});

self.addEventListener('fetch', e => {
    
    // 1. Cache only; Se usa cuando queremos que toda la app sea servida desde el cache.
    e.respondWith(caches.match(e.request));
});