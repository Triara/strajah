'use strict';

const nock = require('nock'),
    _ = require('lodash');
require('chai').should();

nock.recorder.rec({
    dont_print: true,
    output_objects: true
});

module.exports = () => {
    nock.enableNetConnect('http://localhost:3000');

    this.Then(/^strajah forwards it to the protected server$/, done => {
        let protectedPath = this.getValue('requestPath');

        let requestsToProtectedPath = _.filter(nock.recorder.play(), recordedRequest => {
            return recordedRequest.path === protectedPath;
        });
        requestsToProtectedPath[0].status.should.deep.equal(200);
        done();
    });
};
