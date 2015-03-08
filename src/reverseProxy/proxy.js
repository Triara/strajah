'use strict';

const request = require('request'),
    _ = require('lodash');

module.exports = proxy;

function proxy(proxyConfig, incommingRequest, response, next) {
    let foundCoincidences = _.filter(proxyConfig.paths, function (protectedUri) {
        return protectedUri.path === incommingRequest.url;
    });

    if (foundCoincidences.length === 0) {
        response.json(403);
        return next();
    }
    request({
        url: incommingRequest.url,
        body: incommingRequest.body,
        json: true,
        method: incommingRequest.method
    }, function (error, receivedResponse, body) {
        response.send();
        next();
    });
}
