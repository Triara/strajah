'use strict';

module.exports = () => {
    this.Then(/^the response body has "([^"]*)" property$/, (propertyName, done) => {
        this.getValue('body').should.include.keys(propertyName);

        done();
    });
};