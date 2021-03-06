'use strict';

const strajah = require('../../src/server.js'),
    config = require('../../src/config.js'),
    registerServices = require('../../src/registerServices.js'),
    _ = require('lodash');

module.exports = (() => {
    let serverInstance;

    return {
        create: customConfig => {
            serverInstance = strajah.create(customConfig);
        },
        start: done => {
            strajah.start(serverInstance, config.publicPort, done);
        },
        stop: done => {
            strajah.stop(serverInstance, done);
        }
    };
})();
