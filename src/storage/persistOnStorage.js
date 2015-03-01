'use strict';

const database = require('./ancientStorage.js');

module.exports = function (dataToPersist) {
    database.publishValue(dataToPersist);
};
