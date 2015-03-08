'use strict';

const strajah = require('../../src/server.js'),
    config = require('../../src/config.js'),
    registerServices = require('../../src/registerServices.js'),
    _ = require('lodash');

module.exports = (function () {
    let serverInstance;

    return {
        registerServices: function (customProxyConfig) {
            serverInstance = strajah.create();

            registerServices(serverInstance, customProxyConfig);
        },
        start: function (done) {
            strajah.start(serverInstance, config.publicPort, done);
        },
        stop: function (done) {
            strajah.stop(serverInstance, done);
        }
    };
})();
