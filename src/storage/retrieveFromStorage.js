'use strict';

const q = require('q'),
    database = require('./ancientStorage.js');

module.exports = function () {
    return q(database.getValue());
};
