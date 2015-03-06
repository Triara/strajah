'use strict';

const strajah = require('../../src/server.js'),
    config = require('../../src/config.js'),
    registerServices = require('../../src/registerServices.js'),
    _ = require('lodash');


module.exports = (function () {
    let serverInstance = strajah.create();

    return {
        registerServices: function () {
            registerServices(serverInstance);
        },
        start: function (done) {
            strajah.start(serverInstance, config.publicPort, done);
        },
        stop: function (done) {
            strajah.stop(serverInstance, done);
        }
    };
})();
