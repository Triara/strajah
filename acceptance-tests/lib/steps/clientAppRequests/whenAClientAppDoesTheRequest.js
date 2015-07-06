'use strict';

const request = require('request'),
    _ = require('lodash'),
    testConfig = require('../../testConfig.js');
require('chai').should();

module.exports = () => {
    this.When(/^a client app does the following request$/, (requestTable, done) => {
        const requestData = requestTable.hashes()[0];
        this.publishValue('requestPath', requestData.path);

        let optionsForRequest = {
            url: testConfig.publicHost + ':' + testConfig.publicPort + requestData.path,
            json: true,
            method: requestData.method
        };
        if (!_.isUndefined(requestData.body)) {
            optionsForRequest.body =JSON.parse(requestData.body);
        }

        request(optionsForRequest, (error, response) => {
            response.statusCode.should.equal(200);
            done();
        });
    });
};
