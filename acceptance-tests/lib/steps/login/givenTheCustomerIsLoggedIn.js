'use strict';

const should = require('chai').should(),
    customerLogin = require('../../login/customerLogsIn.js'),
    _ = require('lodash');

module.exports = () => {
    this.Given(/^the customer is logged in$/, done => {
        const userCredentials = this.getValue('userCredentials');

        customerLogin(userCredentials.name, userCredentials.password, _.partial(saveResponse, this, done));
    });
};

function saveResponse(world, done, error, response, body) {
    should.not.exist(error);

    world.publishValue('statusCode', response.statusCode);
    world.publishValue('body', body);
    done();
}
