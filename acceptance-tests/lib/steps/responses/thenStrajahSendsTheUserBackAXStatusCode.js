'use strict';

require('chai').should();

module.exports = function () {
    this.Then(/^strajah sends the user back a "([^"]*)" status code$/, function (statusCode, done) {
        let response = this.getValue('response');
        response.statusCode.should.deep.equal(parseInt(statusCode));

        done();
    });
};
