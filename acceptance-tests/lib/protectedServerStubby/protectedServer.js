'use strict';

const restify = require('restify'),
    proxyConfig = require('../../../src/config.js').proxy,
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
        server.listen(proxyConfig.protectedServer.port, callback);
    },
    stop: callback => {
        console.log('Stopping protected server');
        server.close(callback);
    }
};

function createCustomServer(server, pathsAndMethods) {
    performedCalls = [];
    server.get('/api/get-requests', (request, response, next) => {
        response.json(200, {items: performedCalls});
        return next();
    });

    pathsAndMethods.forEach(element => {
        if (element['method'] === 'POST') {
            server.post(element.path, _.partial(middleware, element['statusCode'], element['response']));
        }
        if (element['method'] === 'GET') {
            server.get(element.path, _.partial(middleware, element['statusCode'], element['response']));
        }
    });
}

function middleware(statusCode, responseBody, request, response, next) {
    performedCalls.push({
        uri: request.url,
        method: request.method,
        user: request.header('Authorization').split(' ')[1]
    });

    response.json(parseInt(statusCode), createBodyToSendBack(responseBody));

    console.log('==> Returning response from the protected server');
    return next();
}

function createBodyToSendBack(possibleBody) {
    let body = '';
    try {
        body = JSON.parse(possibleBody);
    } catch (e) {
        //
    }
    return body
}