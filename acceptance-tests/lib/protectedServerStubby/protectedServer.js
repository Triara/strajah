'use strict';

const restify = require('restify'),
    proxyConfig = require('../../../src/reverseProxy/proxyConfig.js'),
    _ = require('lodash');


let server = restify.createServer({
    name: 'protectedServer'
});

server.use(restify.queryParser());
server.use(restify.bodyParser());

let performedCalls = [];

module.exports = {
    create: _.partial(createCustomServer, server),
    start: callback => {
        console.log('Starting protected server stubby at port ' + proxyConfig.protectedServer.port);
        server.listen(proxyConfig.protectedServer.port, callback)
    },
    stop: callback => {
        console.log('Stopping protected server');
        server.close(callback)
    }

};

function createCustomServer(server, pathsAndMethods) {
    server.get('/api/get-requests', (request, response, next) => {
        response.json(200, {items: performedCalls});
        return next();
    });

    pathsAndMethods.forEach(element => {
        if (element.method === 'POST') {
            server.post(element.path, middleware);
        }
    });
}

function middleware(request, response, next) {
    performedCalls.push({
        uri: request.url,
        method: request.method
    });
    response.send(200, 'OK');
    return next();
}
