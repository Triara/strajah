'use strict';

const request = require('request'),
    proxyConfig = require('../config').proxy,
    decodeToken = require('./decodeToken'),
    _ = require('lodash');

module.exports = proxy;

function proxy(proxyConfig, incomingRequest, response, next) {
    const authorizationHeader = incomingRequest.header('Authorization');

    if (_.isUndefined(authorizationHeader) || _.isUndefined(authorizationHeader.split(' ')[1]) || authorizationHeader.split(' ')[0].toLowerCase() !== 'bearer') {
        response.send(401);
        return next();
    }

    const authorizationTokenSet = decodeToken(authorizationHeader.split(' ')[1]);
    if (!_.isUndefined(authorizationTokenSet.error)) {
        response.send(401);
        return next();
    }

    const foundCoincidences = _.filter(proxyConfig.paths, protectedUri => {
        return incomingRequest.url.match(protectedUri.path);
    });
    if (foundCoincidences.length === 0) {
        response.send(403);
        return next();
    }

    request({
        url: proxyConfig.protectedServer.host + ':' + proxyConfig.protectedServer.port + incomingRequest.url,
        body: incomingRequest.body,
        json: true,
        method: incomingRequest.method,
        headers: {
            'Authorization': 'User ' + authorizationTokenSet.userId
        }
    }, function (error, receivedResponse, body) {
        response.send(receivedResponse.statusCode, body);
        return next();
    });
}
