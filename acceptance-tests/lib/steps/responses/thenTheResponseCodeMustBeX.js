'use strict';

require('chai').should();

module.exports = function () {
    this.Then(/^the response code must be (\d+)$/, function (expectedStatusCode, done) {
        this.getValue('statusCode').should.deep.equal(parseInt(expectedStatusCode));

        done();
    });
};
