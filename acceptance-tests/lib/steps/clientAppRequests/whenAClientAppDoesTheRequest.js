'use strict';

const request = require('request'),
    testConfig = require('../../testConfig.js');
require('chai').should();

module.exports = () => {
    this.When(/^a client app does the following request$/, (requestTable, done) => {
        let requestData = requestTable.hashes()[0];
        this.publishValue('requestPath', requestData.path);

        request({
            url: testConfig.publicHost + ':' + testConfig.publicPort + requestData.path,
            json: true,
            body: JSON.parse(requestData.body),
            method: requestData.method
        }, () => {
            done();
        });
    });
};
