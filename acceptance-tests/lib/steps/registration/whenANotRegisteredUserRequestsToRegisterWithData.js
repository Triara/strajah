'use strict';

const request = require('request'),
    should = require('chai').should(),
    _ = require('lodash');

module.exports = function () {
    this.When(/^a not registered user requests to register with data$/, function (registrationDataTable, done) {
        let registrationData = registrationDataTable.hashes()[0];

        request({
            uri: 'http://localhost:3000/api/registration',
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
    should.not.exist(error);

    world.publishValue('response', response);
    done();
}
