'use strict';

module.exports = () => {
    this.After('@protectedServer', done => {
        this.protectedServer.stop(done);
    });
};
