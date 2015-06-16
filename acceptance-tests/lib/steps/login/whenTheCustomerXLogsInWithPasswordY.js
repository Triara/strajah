'use strict';

const should = require('chai').should(),
    customerLogin = require('../../login/customerLogsIn.js'),
    _ = require('lodash');

module.exports = () => {
    this.When(/^the customer "([^"]*)" logs in with password "([^"]*)"$/, (customerName, password, done) => {
        customerLogin(customerName, password, _.partial(saveResponse, this, done));
    });
};

function saveResponse(world, done, error, response, body) {
    should.not.exist(error);

    world.publishValue('statusCode', response.statusCode);
    world.publishValue('body', body);
    done();
}
