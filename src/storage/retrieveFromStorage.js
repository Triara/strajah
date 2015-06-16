'use strict';

const q = require('q'),
    database = require('./ancientStorage.js');

module.exports = () => {
    return q(database.getValue());
};
