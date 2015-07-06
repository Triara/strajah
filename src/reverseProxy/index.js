'use strict';

const reverseProxy = require('./proxy.js'),
    _ = require('lodash');

module.exports = {
    registerIn: registerIn
};

function registerIn (server, customConfig) {
    let proxyMiddleware = _.partial(reverseProxy, customConfig);
    server.post('/(.*)/', proxyMiddleware);
    server.get('/(.*)/', proxyMiddleware);
}
