'use strict';

const database = require('../../../../src/storage/ancientStorage.js');

module.exports = () => {
    this.After(done => {
        database.reset();
        done();
    });
};
