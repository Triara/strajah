'use strict';

module.exports = function () {
    this.Before(function (done) {
        this.serverInstance.registerServices();
        this.serverInstance.start(done);
    });

    this.After(function (done) {
        this.serverInstance.stop(done);
    });
};
