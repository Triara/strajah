'use strict';

const strajah = require('../../../../src/server.js'),
    config = require('../../../../src/config.js'),
    registerServices = require('../../../../src/registerServices.js');

module.exports = function () {
    let serverInstance = strajah.create();
    registerServices(serverInstance);

    this.Before(function (done) {
        strajah.start(serverInstance, config.publicPort, done);
    });

    this.After(function (done) {
        strajah.stop(serverInstance, done);
    });
};
