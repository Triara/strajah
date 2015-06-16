'use strict';

const heartbeat = require('../../src/heartbeat/heartbeat.js');
require('chai').should();

describe('Heartbeat status', () => {

    it('must send back a response', () => {
        let obtainedStatusCode;

        let res = {
            send: value => {
                obtainedStatusCode = value;
            }
        };

        heartbeat(null, res, () => {});

        obtainedStatusCode.should.equal(200);
    });

    it('must call the next function', (done) => {
        let res = {
            send: () => {}
        };

        heartbeat(null, res, done);
    });
});
