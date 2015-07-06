'use strict';

const request = require('request'),
    testConfig = require('../../testConfig.js');
require('chai').should();

module.exports = () => {
    this.Before("~@loadCustomConfig", done => {
        this.serverInstance.registerServices();
        this.serverInstance.start(done);
    });

    this.After(done => {
        const world = this;

        resetDataBase(() => {
            world.serverInstance.stop(done);
        });
    });
};

function resetDataBase (callback) {
    const requestOptions = {
        url: testConfig.publicHost + ':' + testConfig.publicPort + '/auth/users',
        method: 'DELETE'
    };

    request(requestOptions, (err, response) => {
        response.statusCode.should.equal(204);
        callback();
    });
}
