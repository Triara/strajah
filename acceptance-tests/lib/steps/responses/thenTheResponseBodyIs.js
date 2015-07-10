'use strict';

const should = require('chai').should(),
    _ = require('lodash');

module.exports = () => {
    this.Then(/^the response body is (.*?)$/, function (expectedBody, done) {
        const body = this.getValue('body');
        expectedBody = JSON.parse(expectedBody);

        _.forEach(expectedBody, (expectedValue, expectedKey) => {
            should.exist(body[expectedKey]);
            body[expectedKey].should.equal(expectedValue);
        });

        done();
    });
};
