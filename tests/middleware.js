var assert = require('assert');
var request = require('request');
var sinon = require('sinon');

var errors = require('../lib/errors.js');

describe('middleware',function(){

    describe('basic usage', function(){

        var fakeReq = {};
        var fakeRes = {};

        beforeEach(function(){
            fakeReq = {};
            fakeRes = {
                send : function(){}
            };
        });

        it('private', function(done){
            sinon.mock(fakeRes).expects('send').once().withArgs(403,errors.forbidden);

            var strajah = require('../lib/strajah.js')();
            strajah(fakeReq, fakeRes, function(canContinue){
                assert.equal(canContinue, false);
                done();
            });
        });

        it('public', function(done){
            fakeReq.url = '/public';
            sinon.mock(fakeRes).expects('send').never();

            var options = {
                public : [
                    {
                        path: "/public",
                        methods: "GET"
                    }
                ]
            };

            var strajah = require('../lib/strajah.js')(options);
            strajah(fakeReq, fakeRes, function(canContinue){
                assert.equal(canContinue, true);
                done();
            });
        });
    });
});
