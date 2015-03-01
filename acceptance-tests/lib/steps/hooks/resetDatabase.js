'use strict';

const database = require('../../../../src/storage/ancientStorage.js');

module.exports = function () {
    this.After(function (done) {
        database.reset();
        done();
    });
};
