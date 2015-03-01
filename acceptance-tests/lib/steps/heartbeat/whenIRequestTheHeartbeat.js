'use strict';

const _ = require('lodash'),
    should = require('chai').should(),
    request = require('request');

module.exports = whenRequestHeartbeatStep;


function whenRequestHeartbeatStep() {
    this.When(/^I request the heartbeat$/, function (done) {
        request({
                url: 'http://localhost:3000/api/heartbeat',
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
