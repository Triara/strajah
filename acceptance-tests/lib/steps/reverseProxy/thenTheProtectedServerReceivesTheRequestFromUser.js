'use strict';

const _ = require('lodash'),
    getProtectedServerCalls = require('../../protectedServerStubby/getProtectedServerCalls.js');
const should = require('chai').should();

module.exports = () => {
    this.Then(/^the protected server receives the request from user "([^"]*)"$/, (expectedUser, done) => {
        const expectedPath = this.getValue('requestPath');

        getProtectedServerCalls((error, response, body) => {

            const foundRequest = _.reduce(_.map(body.items, performedCall => {
                return performedCall.user === expectedUser && performedCall.uri === expectedPath;
            }), (accumulated, actualElement) => {
                return accumulated || actualElement;
            });

			should.exist(foundRequest);
            foundRequest.should.equal(true);
            done();
        });
    });
};
