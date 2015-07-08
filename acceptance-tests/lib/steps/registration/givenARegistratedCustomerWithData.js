'use strict';

const request = require('request'),
    testConfig = require('../../testConfig.js'),
    should = require('chai').should(),
    _ = require('lodash');

module.exports = () => {
    this.Given(/^a registered customer with data$/, (registrationDataTable, done) => {
        const registrationData = registrationDataTable.hashes()[0];

        this.publishValue('userCredentials', {
            name: registrationData['user name'],
            password: registrationData['password']
        });

        request({
            uri: testConfig.publicHost + ':' + testConfig.publicPort + '/auth/users',
            method: 'POST',
            json: true,
            body: {
                'name': registrationData['user name'],
                'password': registrationData['password']
            }
        }, _.partial(saveResponse, this, done));
    });
};

function saveResponse(world, done, error, response) {
    world.publishValue('statusCode', response.statusCode);
    done();
}
