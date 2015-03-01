'use strict';

const request = require('request'),
    testConfig = require('../../testConfig.js'),
    should = require('chai').should(),
    _ = require('lodash');

module.exports = function () {
    this.Then(/^the customer is able to log in with his credentials$/, function (credentialsTable, done) {
        let credentials = credentialsTable.hashes()[0];

        request(createLoginOptions(credentials), _.partial(checkLoginCorrect, done));
    });

    this.Then(/^the customer is not able to log in with his credentials$/, function (credentialsTable, done) {
        let credentials = credentialsTable.hashes()[0];

        request(createLoginOptions(credentials), _.partial(checkLoginIncorrect, done));
    });
};

function createLoginOptions (credentials) {
    return {
        uri: testConfig.publicHost + ':' + testConfig.publicPort + '/api/auth/login',
            method: 'POST',
        json: true,
        body: {
            'name': credentials['user name'],
            'password': credentials['password']
        }
    }
}

function checkLoginCorrect (done, error, response) {
    should.not.exist(error);

    response.statusCode.should.deep.equal(200);
    done();
}

function checkLoginIncorrect (done, error, response) {
    should.not.exist(error);

    response.statusCode.should.not.deep.equal(200);
    done();
}