'use strict';

const _ = require('lodash'),
    should = require('chai').should(),
    testConfig = require('../../testConfig.js'),
    request = require('request');

module.exports = whenRequestHeartbeatStep;


function whenRequestHeartbeatStep() {
    this.When(/^I request the heartbeat$/, function (done) {
        request({
                url: testConfig.publicHost + ':' + testConfig.publicPort + '/api/heartbeat',
                method: 'GET'
            }
            , _.partial(saveResponse, this, done));
    });
}

function saveResponse(world, done, err, res, body){
    should.not.exist(err);

    world.publishValue('statusCode', res.statusCode);
    world.publishValue('body', body);
    done();
}
