'use strict';

const request = require('request'),
    _ = require('lodash'),
    testConfig = require('../../testConfig.js');
require('chai').should();

module.exports = () => {
    this.When(/^the customer does the following request to strajah$/, (requestTable, done) => {
        const world = this;

        const requestData = requestTable.hashes()[0];
        world.publishValue('requestPath', requestData.path);

        let optionsForRequest = {
            url: testConfig.publicHost + ':' + testConfig.publicPort + requestData.path,
            json: true,
            method: requestData.method,
            headers: {
                'Authorization': 'Bearer ' + JSON.parse(this.getValue('body')).accessToken
            }
        };

        if (!_.isUndefined(requestData.body)) {
            optionsForRequest.body = JSON.parse(requestData.body);
        }

        request(optionsForRequest, (error, response, body) => {
            world.publishValue('statusCode', response.statusCode);
            world.publishValue('body', body);
            done();
        });
    });
};
