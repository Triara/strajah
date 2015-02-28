'use strict';

const requestSetter = require('../../support/requestSetter.js'),
    strajah = require('../../../../lib/strajah.js');

module.exports = function () {
    this.Given(/^strajah has default settings/, function (done) {
        requestSetter.strajah = strajah({});
        done();
    });
};
