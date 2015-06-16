'use strict';

const database = require('./ancientStorage.js');

module.exports = dataToPersist => {
    database.publishValue(dataToPersist);
};
