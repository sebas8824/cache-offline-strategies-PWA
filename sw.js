const CACHE_NAME = 'cache-1'

self.addEventListener('install', e => {
    // Adicionar el app shell (Lo que se necesita para que la pagina cargue bien.)
    const cp = caches.open(CACHE_NAME)
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
    
    /* 1. Cache only; Se usa cuando queremos que toda la app sea servida desde el cache.
    e.respondWith(caches.match(e.request)); */

    /* 2. Cache with network fallback: Intenta primero cache, pero si no se encuentra, va a internet */
    const rc = caches.match(e.request)
        .then(response => {
            if(response) return response;

            // No existe el archivo, tengo que ir a la web.
            console.log('No existe', e.request.url);
            return fetch(e.request)
                .then( newResponse => {

                    // Se incluye en el cache, para que a pesar que no exista el recurso y lo baje del sw, lo tenga ya incluido y no haga
                    // la misma operacion siempre de ahi en adelante.
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(e.request, newResponse);
                        })
                    return newResponse.clone();
                });
        });


    e.respondWith(rc);
});