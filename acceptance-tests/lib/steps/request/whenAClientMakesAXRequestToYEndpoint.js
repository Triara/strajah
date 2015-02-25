'use strict';

const world = require('../../support/world.js');

module.exports = function () {
    this.When(/^a client makes a '(.*)' request to '(.*)' endpoint$/, function (method, path, done) {
        world.req.url = path;
        world.req.method = method;

        world.strajah(world.req, world.res, function(canContinue){
            world.chainCanContinue = canContinue;
            done();
        });
    });
};
