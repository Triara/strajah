'use strict';

const world = require('../../support/world.js');
require('chai').should();

module.exports = function () {
    this.Then(/^the response body must be '(.*)'$/, function (body, done) {
        JSON.parse(body).should.deep.equal(world.res.body);
        done();
    });
};
