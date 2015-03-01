'use strict';

const request = require('request'),
    testConfig = require('../../testConfig.js'),
    should = require('chai').should(),
    _ = require('lodash');

module.exports = function () {
    this.When(/^the customer "([^"]*)" logs in with password "([^"]*)"$/, function (customerName, password, done) {
        request({
            uri: testConfig.publicHost + ':' + testConfig.publicPort + '/api/auth/login',
            method: 'POST',
            json: true,
            body: {
                'name': customerName,
                'password': password
            }
        }, _.partial(saveResponse, this, done));
    });
};

function saveResponse(world, done, error, response, body) {
    should.not.exist(error);

    world.publishValue('statusCode', response.statusCode);
    world.publishValue('body', body);
    done();
}
