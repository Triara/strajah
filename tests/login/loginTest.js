'use strict';

const loginMiddleware = require('../../src/login/login.js');
require('chai').should();


describe('Login response code', function(){
    it('must call the next function', function(done){
        let res = {
            json: function(){}
        };

        loginMiddleware(null, res, done);
    });

    it('must send back a response', function(){
        let obtainedStatusCode;

        let res = {
            json: function(value){
                obtainedStatusCode = value;
            }
        };

        loginMiddleware(null, res, function(){});
        obtainedStatusCode.should.equal(200);
    });
});

describe('Login response body', function () {
    it('has an accessToken property', function () {
        let obtainedBody;

        let res = {
            json: function(statusCode, body){
                obtainedBody = body;
            }
        };

        loginMiddleware(null, res, function(){});
        obtainedBody.should.include.keys('accessToken');
    });
});
