'use strict';

const requestSetter = require('../../support/requestSetter.js');
require('chai').should();

module.exports = function () {
    this.Then(/^the response status code is (\d+)$/, function (statusCode, done) {
        parseInt(statusCode).should.eql(requestSetter.res.statusCode);
        done();
    });
};
