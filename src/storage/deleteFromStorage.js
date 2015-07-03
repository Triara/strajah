'use strict';

const mongoClient = require('mongodb').MongoClient,
    config = require('../config.js');

const url = 'mongodb://' + config.database.host + ':' + config.database.port + '/' + config.database.name;

module.exports = filter => {
    return new Promise((resolve) => {

        mongoClient.connect(url, (err, db) => {

            const collection = db.collection(config.database.collectionName);

            collection.remove(filter);
            resolve();
            db.close();
        });
    });
};
