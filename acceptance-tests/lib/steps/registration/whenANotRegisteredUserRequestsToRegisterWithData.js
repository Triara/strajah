'use strict';

const request = require('request'),
    testConfig = require('../../testConfig.js'),
    should = require('chai').should(),
    _ = require('lodash');

module.exports = () => {
    this.When(/^a not registered user requests to register with data$/, (registrationDataTable, done) => {
        let registrationData = registrationDataTable.hashes()[0];

        request({
            uri: testConfig.publicHost + ':' + testConfig.publicPort + '/auth/users',
            method: 'POST',
            json: true,
            body: {
                'name': registrationData['user name'],
                'password': registrationData['password']
            }
        }, _.partial(saveRequestResponse, this, done));
    });
};

function saveRequestResponse(world, done, error, response) {
    world.publishValue('statusCode', response.statusCode);
    done();
}
