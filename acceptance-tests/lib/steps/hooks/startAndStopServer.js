'use strict';

module.exports = () => {
    this.Before("~@loadCustomConfig", done => {
        this.serverInstance.registerServices();
        this.serverInstance.start(done);
    });

    this.After("~@loadCustomConfig", done => {
        this.serverInstance.stop(done);
    });
};
