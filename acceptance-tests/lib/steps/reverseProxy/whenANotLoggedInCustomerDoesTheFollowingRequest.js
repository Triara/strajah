'use strict';

const request = require('request'),
    _ = require('lodash'),
    testConfig = require('../../testConfig.js');
require('chai').should();

module.exports = () => {
    this.When(/^a not logged in customer does the following request$/, (requestTable, done) => {
        const world = this;
        const requestData = requestTable.hashes()[0];
        world.publishValue('requestPath', requestData.path);

        let optionsForRequest = {
            url: testConfig.publicHost + ':' + testConfig.publicPort + requestData.path,
            json: true,
            method: requestData.method
        };

        if (!_.isUndefined(requestData.body)) {
            optionsForRequest.body = JSON.parse(requestData.body);
        }

        request(optionsForRequest, (error, response) => {
            world.publishValue('statusCode', response.statusCode);
            done();
        });
    });
};
