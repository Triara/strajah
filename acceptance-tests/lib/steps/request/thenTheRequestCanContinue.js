'use strict';

const world = require('../../support/world.js');
require('chai').should();

module.exports = function () {
    this.Then(/^the request can continue$/, function (done) {
        world.chainCanContinue.should.be.false;
        done();
    });
};
