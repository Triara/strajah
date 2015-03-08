'use strict';

module.exports = function () {
    this.Before("~@loadCustomConfig", function (done) {
        this.serverInstance.registerServices();
        this.serverInstance.start(done);
    });

    this.After("~@loadCustomConfig", function (done) {
        this.serverInstance.stop(done);
    });
};
