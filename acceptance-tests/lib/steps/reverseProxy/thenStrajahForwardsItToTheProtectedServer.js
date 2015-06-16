'use strict';

const proxyConfig = require('../../../../src/reverseProxy/proxyConfig.js'),
    request = require('request'),
    _ = require('lodash');

require('chai').should();

module.exports = () => {
    this.Then(/^strajah forwards it to the protected server$/, done => {
        const protectedPath = this.getValue('requestPath');

        request({
            url: proxyConfig.protectedServer.host + ':' + proxyConfig.protectedServer.port + '/api/get-requests',
            method: 'GET',
            json: true
        }, (error, response, body) => {
            _.includes(_.map(body.items, performedCall => {
                return performedCall.uri
            }), protectedPath);

            done();
        });
    });
};
