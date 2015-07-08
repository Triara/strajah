'use strict';

const should = require('chai').should();

module.exports = () => {
    this.Then(/^the response body has "([^"]*)" property$/, (propertyName, done) => {

        should.exist(JSON.parse(this.getValue('body'))[propertyName]);
        done();
    });
};