'use strict';

const requestSetter = require('../../support/requestSetter.js');

module.exports = function () {
    this.When(/^a client makes a '(.*)' request to '(.*)' endpoint$/, function (method, path, done) {
        requestSetter.req.url = path;
        requestSetter.req.method = method;

        requestSetter.strajah(requestSetter.req, requestSetter.res, function(canContinue){
            requestSetter.chainCanContinue = canContinue;
            done();
        });
    });
};
