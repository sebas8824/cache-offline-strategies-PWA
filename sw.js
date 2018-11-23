/* Va todo lo del APP SHELL */
const CACHE_STATIC_NAME = 'static-v2';
/* Cache generado por procesos como el de internet fallback */
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
/* Librerias externas */
const CACHE_IMMUTABLE_NAME = 'immutable-v1';
const CACHE_DYNAMIC_LIMIT = 50;

function cleanCache(cacheName, nItems) {
    caches.open(cacheName)
        .then(cache => {
            cache.keys()
                .then(keys => {
                    if(keys.length > nItems) {
                        cache.delete(keys[0])
                            .then(cleanCache(cacheName, nItems))
                    }
                });
        });
}

self.addEventListener('install', e => {
    const sc = caches.open(CACHE_STATIC_NAME)
        .then(cache => {
            return cache.addAll([
                /*Se usa / para que no falle al llamar localhost:8080/*/
                '/',
                '/index.html', 
                '/css/style.css', 
                '/img/main.jpg',
                '/img/no-img.jpg',                 
                '/js/app.js'
            ]);
        });

    const dc = caches.open(CACHE_IMMUTABLE_NAME)
        .then(cache => cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'));

    // Esperar hasta que cp termine.
    e.waitUntil(Promise.all([sc, dc]));    
});

self.addEventListener('fetch', e => {
    
    /* 1. Cache only; Se usa cuando queremos que toda la app sea servida desde el cache.
    e.respondWith(caches.match(e.request)); */

    /* 2. Cache with network fallback: Intenta primero cache, pero si no se encuentra, va a internet 
    const rc = caches.match(e.request)
        .then(response => {
            if(response) return response;

            // No existe el archivo, tengo que ir a la web.
            console.log('No existe', e.request.url);
            return fetch(e.request)
                .then( newResponse => {

                    // Se incluye en el cache, para que a pesar que no exista el recurso y lo baje del sw, lo tenga ya incluido y no haga
                    // la misma operacion siempre de ahi en adelante.
                    caches.open(CACHE_DYNAMIC_NAME)
                        .then(cache => {
                            cache.put(e.request, newResponse);
                            cleanCache(CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT);
                        })
                    return newResponse.clone();
                });
        });


    e.respondWith(rc);*/

    /* 3. Network with cache fallback */
    /* const networkResponse = fetch(e.request)
        .then(resp => {
            if(!resp) return caches.match(e.request);
            console.log('Fetch', resp);
            caches.open(CACHE_DYNAMIC_NAME)
                .then(cache => {
                    cache.put(e.request, resp);
                    cleanCache(CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT);
                });

            return resp.clone();
        })
        .catch(err => {
            return caches.match(e.request);
        });
    e.respondWith(networkResponse);*/

    /* 4. Cache with network update */
    // Util cuando el rendimiento es crítico.
    // Actualizaciones siempre estaran un paso atrás.
    /*if (e.request.url.includes('bootstrap')) {
        return e.respondWith(caches.match( e.request ));
    }

    const resp = caches.open(CACHE_STATIC_NAME)
        .then(cache => {
            // Actualiza el nuevo cache en el static, pero sirve lo que hay actualmente.
            fetch(e.request).then(newResponse => cache.put(e.request, newResponse));
            return cache.match(e.request);
        });


    e.respondWith(resp);*/

    /* 5. Cache & network race */
    const resp = new Promise( (resolve, reject) => {
        let rejected = false;
        const failedOnce = () => {
            // No existe ni en cache, ni en fetch valido.
            if(rejected) {
                // Coloca una imagen por defecto
                if(/\.(png|jpg)$/i.test(e.request.url)) {    
                    resolve(caches.match('/img/no-img.jpg'));
                } else {
                    reject('No se encontro respuesta');
                }
            } else {
                rejected = true;
            }
        };


        fetch(e.request).then(res => {
            res.ok ? resolve(res) : failedOnce();
        }).catch(failedOnce);

        caches.match(e.request).then(res => {
            res ? resolve(res): failedOnce();
        }).catch(failedOnce);
    });
    

    e.respondWith(resp);

});