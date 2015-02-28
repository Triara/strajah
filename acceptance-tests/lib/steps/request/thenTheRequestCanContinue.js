'use strict';

const requestSetter = require('../../support/requestSetter.js');
require('chai').should();

module.exports = function () {
    this.Then(/^the request can continue$/, function (done) {
        requestSetter.chainCanContinue.should.be.false;
        done();
    });
};
