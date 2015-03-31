'use strict';

const customerLogin = require('../../login/customerLogsIn.js'),
    should = require('chai').should(),
    _ = require('lodash');

module.exports = function () {
    this.Then(/^the customer is able to log in with his credentials$/, function (credentialsTable, done) {
        const credentials = credentialsTable.hashes()[0],
            customerName = credentials['user name'],
            password = credentials['password'];

        customerLogin(customerName, password, _.partial(checkLoginCorrect, done));
    });

    this.Then(/^the customer is not able to log in with his credentials$/, function (credentialsTable, done) {
        const credentials = credentialsTable.hashes()[0],
            customerName = credentials['user name'],
            password = credentials['password'];

        customerLogin(customerName, password, _.partial(checkLoginIncorrect, done));
    });
};

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