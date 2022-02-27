'use strict';

const Hapi = require('@hapi/hapi');

const postSearchRoute = require('./routes/postSearch')

const routes = [postSearchRoute]

const init = async () => {

    const server = Hapi.server({
        port: 3001,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });

    routes.forEach(route => {
        server.route(route);
    })

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            return 'Hello World!';
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};
init();
