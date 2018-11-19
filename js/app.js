

if ( navigator.serviceWorker ) {
    navigator.serviceWorker.register('/sw.js');
}

if (window.caches) {
    // Los adiciona en el Cache storage
    caches.open('prueba-1');
    caches.open('prueba-2');
    // Has no devuelve un boolean, devuelve una promesa
    //caches.has('prueba-2').then(console.log);
    // Borrar un cache y devuelve un booleano del estado.
    //caches.delete('prueba-1').then(console.log);

    // Similar a abrir una conexion a una BD
    caches.open('cache-v1.1').then(cache => {
        // Adicionar todo el index.html en el cache-v1.1
        cache.add('/index.html');

        // Adicionar varios elementos
        cache.addAll(['/index.html', '/css/style.css', '/img/main.jpg'])
            .then(() => {
                //1*
                //cache.delete('/css/style.css');
                // Cambiando el contenido de index.html
                cache.put('/index.html', new Response('Hola Mundo'));
            });

        // No se elimina de una, por que adicionar es mas lento que eliminarlo.
        // Por eso debe ir dentro del then del add. (1*)
        //cache.delete('/css/style.css');


        // Leer archivo dentro del cache
        cache.match('/index.html').then(response => {
            response.text().then(console.log);
        });
    });

    // Retornar todos los cache disponibles de manera asincrona
    caches.keys().then(keys => {
        console.log(keys);
    });

};