'use strict';

const protectedServer = require('../../protectedServerStubby/protectedServer.js');

module.exports = () => {
    this.Given(/^the protected server has the following paths$/, (tableOfPathsAndMethods, done) => {
        protectedServer.create(tableOfPathsAndMethods.hashes());

        this.protectedServer = protectedServer;

        protectedServer.start(done);
    });
};
