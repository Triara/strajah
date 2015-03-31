'use strict';

const request = require('request'),
    testConfig = require('../testConfig.js'),
    should = require('chai').should(),
    _ = require('lodash');

module.exports = function (customerName, password, callback) {
    request({
        uri: testConfig.publicHost + ':' + testConfig.publicPort + '/api/auth/login',
        method: 'POST',
        json: true,
        body: {
            'name': customerName,
            'password': password
        }
    }, function (err, response, body) {
        callback(err, response, body);
    });
};
