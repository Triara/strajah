'use strict';

let assert = require('assert');
let request = require('request');
let restify = require('restify');

let strajah = require('../lib/strajah.js');
let errors = require('../lib/errors.js');

describe('compatibility',function(){
    describe('restify', function(){

        it('private',function(done){
            let server = restify.createServer({
                name: 'restify-test-server'
            });

            server.use(strajah());
            server.get('/private', function(req,res,next){
                res.send(200);
                next();
            });
            server.listen(3000, function(){
                let options = {
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
            let server = restify.createServer({
                name: 'restify-test-server'
            });

            let options = {
                public: [
                    {
                        path: '/public',
                        methods: 'GET'
                    }

                ]
            };

            let expectedBody = {validbody: true};

            server.use(strajah(options));
            server.get('/public', function(req,res,next){
                res.send(200, expectedBody);
                next();
            });
            server.listen(3000, function(){
                let options = {
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
