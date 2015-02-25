var assert = require('assert');
var world = require('../support/world.js');
var strajah = require('../../../lib/strajah.js');

module.exports = function(){
    this.Given(/^strajah has default options$/, function (callback) {
        world.strajah = strajah({});
        callback();
    });

    this.When(/^a client makes a '(.*)' request to '(.*)' endpoint$/, function (method, path, callback) {
        world.req.url = path;
        world.req.method = method;

        world.strajah(world.req, world.res, function(canContinue){
            world.chainCanContinue = canContinue;
            callback();
        });
    });

    this.Then(/^the response status code is (\d+)$/, function (statusCode, callback) {
        assert.equal(world.res.statusCode, statusCode);
        callback();
    });

    this.Then(/^the response body must be '(.*)'$/, function (body, callback) {
        assert.deepEqual(world.res.body, JSON.parse(body));
        callback();
    });

    this.Then(/^the request can continue$/, function (callback) {
        assert.equal(world.chainCanContinue, false);
        callback();
    });
};

