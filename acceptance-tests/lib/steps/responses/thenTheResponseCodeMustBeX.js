'use strict';

const requestSetter = require('../../support/requestSetter.js');
require('chai').should();

module.exports = function () {
    this.Then(/^the response body must be '(.*)'$/, function (body, done) {
        JSON.parse(body).should.deep.equal(requestSetter.res.body);
        done();
    });
};
