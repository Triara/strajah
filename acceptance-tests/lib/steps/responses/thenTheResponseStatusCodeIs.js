'use strict';

const world = require('../../support/world.js');
require('chai').should();

module.exports = function () {
    this.Then(/^the response status code is (\d+)$/, function (statusCode, done) {
        parseInt(statusCode).should.eql(world.res.statusCode);
        done();
    });
};
