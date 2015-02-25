'use strict';

const world = require('../../support/world.js'),
    strajah = require('../../../../lib/strajah.js');

module.exports = function () {
    this.Given(/^strajah has default settings/, function (done) {
        world.strajah = strajah({});
        done();
    });
};
