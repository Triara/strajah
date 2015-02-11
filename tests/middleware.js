'use strict';

let assert = require('assert');
let request = require('request');
let sinon = require('sinon');

let errors = require('../lib/errors.js');

describe('middleware',function(){

    describe('basic usage', function(){
        let fakeReq;
        let fakeRes;

        beforeEach(function(){
            fakeReq = {};
            fakeRes = {
                send : function(){}
            };
        });

        it('private', function(done){
            sinon.mock(fakeRes).expects('send').once().withArgs(403,errors.forbidden);

            let strajah = require('../lib/strajah.js')();
            strajah(fakeReq, fakeRes, function(canContinue){
                assert.equal(canContinue, false);
                done();
            });
        });

        it('public', function(done){
            fakeReq.url = '/public';
            sinon.mock(fakeRes).expects('send').never();

            let options = {
                public : [
                    {
                        path: "/public",
                        methods: "GET"
                    }
                ]
            };

            let strajah = require('../lib/strajah.js')(options);
            strajah(fakeReq, fakeRes, function(canContinue){
                assert.equal(canContinue, true);
                done();
            });
        });
    });
});
