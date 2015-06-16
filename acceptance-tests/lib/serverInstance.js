'use strict';

const strajah = require('../../src/server.js'),
    config = require('../../src/config.js'),
    registerServices = require('../../src/registerServices.js'),
    _ = require('lodash');

module.exports = (() => {
    let serverInstance;

    return {
        registerServices: customProxyConfig => {
            serverInstance = strajah.create();

            registerServices(serverInstance, customProxyConfig);
        },
        start: done => {
            strajah.start(serverInstance, config.publicPort, done);
        },
        stop: done => {
            strajah.stop(serverInstance, done);
        }
    };
})();
