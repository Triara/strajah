'use strict';

const request = require('request'),
    proxyConfig = require('./proxyConfig'),
    _ = require('lodash');

module.exports = proxy;

function proxy(proxyConfig, incomingRequest, response, next) {
    const foundCoincidences = _.filter(proxyConfig.paths, protectedUri => {
        return incomingRequest.url.match(protectedUri.path);
    });

    if (foundCoincidences.length === 0) {
        response.json(403);
        return next();
    }

    request({
        url: proxyConfig.protectedServer.host + ':' + proxyConfig.protectedServer.port + incomingRequest.url,
        body: incomingRequest.body,
        json: true,
        method: incomingRequest.method
    }, function (error, receivedResponse, body) {
        response.send(200, body);
        next();
    });
}
