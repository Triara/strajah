'use strict';

const request = require('request'),
    testConfig = require('../../testConfig.js'),
    should = require('chai').should(),
    _ = require('lodash');

module.exports = function () {
    this.Given(/^a registrated customer with data$/, function (registrationDataTable, done) {
        let registrationData = registrationDataTable.hashes()[0];

        request({
            uri: testConfig.publicHost + ':' + testConfig.publicPort + '/api/registration',
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
    should.not.exist(error);

    world.publishValue('statusCode', response.statusCode);
    done();
}
