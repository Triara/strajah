'use strict';

const request = require('request'),
    testConfig = require('../testConfig.js'),
    should = require('chai').should(),
    _ = require('lodash');

module.exports = function (customerName, password, callback) {
    request({
        uri: testConfig.publicHost + ':' + testConfig.publicPort + '/auth/login',
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + createBasicAuthorization(customerName, password)
        }
    }, function (err, response, body) {
        callback(err, response, body);
    });
};

function createBasicAuthorization(name, password) {
    return new Buffer(name + ':' + password).toString('base64');
}
