'use strict';

const heartbeat = require('../../src/heartbeat/heartbeat.js');
require('chai').should();

describe('Heartbeat status', function(){

    it('must send back a response', function(){
        let obtainedStatusCode;

        let res = {
            send: function(value){
                obtainedStatusCode = value;
            }
        };

        heartbeat(null, res, function(){});

        obtainedStatusCode.should.equal(200);
    });

    it('must call the next function', function(done){
        let res = {
            send: function(){}
        };

        heartbeat(null, res, done);
    });
});
