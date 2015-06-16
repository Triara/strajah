'use strict';

require('chai').should();

module.exports = () => {
    this.Then(/^the response code must be (\d+)$/, (expectedStatusCode, done) => {
        this.getValue('statusCode').should.deep.equal(parseInt(expectedStatusCode));

        done();
    });
};
