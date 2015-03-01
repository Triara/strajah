'use strict';

module.exports = function () {
    this.Then(/^the response body has "([^"]*)" property$/, function (propertyName, done) {
        this.getValue('body').should.include.keys(propertyName);

        done();
    });
};