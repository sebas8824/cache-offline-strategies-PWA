self.addEventListener('fetch', event => {
    const offlineResponse = new Response(`
        Bienvenido a mi pagina web

        Disculpa pero para usarla, necesitas internet   
    `);

    const respuesta = fetch(event.request)
        .catch(() => offlineResponse);

    event.respondWith(respuesta);
})


