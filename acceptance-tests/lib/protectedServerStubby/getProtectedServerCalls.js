'use strict';

const proxyConfig = require('../../../src/reverseProxy/proxyConfig.js'),
    request = require('request');

module.exports = callback => {
    request({
        url: proxyConfig.protectedServer.host + ':' + proxyConfig.protectedServer.port + '/api/get-requests',
        method: 'GET',
        json: true
    }, (error, response, body) => {
        callback(error, response, body)
    });
};
