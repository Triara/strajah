'use strict';

const _ = require('lodash'),
    getProtectedServerCalls = require('../../protectedServerStubby/getProtectedServerCalls.js');
require('chai').should();

module.exports = () => {
    this.Then(/^strajah forwards it to the protected server$/, done => {
        const protectedPath = this.getValue('requestPath');

        getProtectedServerCalls((error, response, body) => {
            _.includes(_.map(body.items, performedCall => {
                return performedCall.uri
            }), protectedPath);

            done();
        });
    });
};
