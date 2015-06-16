'use strict';

const request = require('request'),
    testConfig = require('../../testConfig.js');
require('chai').should();

module.exports = () => {
    this.When(/^a client app does the following request$/, (requestTable, done) => {
        let requestData = requestTable.hashes()[0];
        this.publishValue('requestPath', requestData.path);

        const optionsForRequest = {
            url: testConfig.publicHost + ':' + testConfig.publicPort + requestData.path,
            json: true,
            body: JSON.parse(requestData.body),
            method: requestData.method
        };

        request(optionsForRequest, (error, response) => {
            response.statusCode.should.equal(200);
            done();
        });
    });
};
