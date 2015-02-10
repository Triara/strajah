var assert = require('assert');
var request = require('request');
var restify = require('restify');

var strajah = require('../lib/strajah.js');
var errors = require('../lib/errors.js');

describe('compatibility',function(){
    describe('restify', function(){

        it('private',function(done){
            var server = restify.createServer({
                name: 'restify-test-server'
            });

            server.use(strajah());
            server.get('/private', function(req,res,next){
                res.send(200);
                next();
            });
            server.listen(3000, function(){
                var options = {
                    url: 'http://localhost:3000/private',
                    headers: {},
                    method: 'GET'
                };

                request(options, function (err, res, body) {
                    server.close();
                    assert.equal(err, null);
                    assert.equal(res.statusCode, 403, body);
                    body = JSON.parse(body);
                    assert.deepEqual(body, errors.forbidden);
                    done();
                });
            });
        });

        it('public',function(done){
            var server = restify.createServer({
                name: 'restify-test-server'
            });

            var options = {
                public : [
                    {
                        path: '/public',
                        methods: 'GET'
                    }

                ]
            };

            var expectedBody = {validbody:true};

            server.use(strajah(options));
            server.get('/public', function(req,res,next){
                res.send(200, expectedBody);
                next();
            });
            server.listen(3000, function(){
                var options = {
                    url: 'http://localhost:3000/public',
                    method: 'GET'
                };

                request(options, function (err, res, body) {
                    server.close();
                    assert.equal(err, null);
                    assert.equal(res.statusCode, 200, body);
                    body = JSON.parse(body);
                    assert.deepEqual(body, expectedBody);
                    done();
                });
            });
        });
    });
});
