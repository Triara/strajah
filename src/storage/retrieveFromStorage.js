'use strict';

const mongoClient = require('mongodb').MongoClient,
    config = require('../config.js');

const url = 'mongodb://' + config.database.host + ':' + config.database.port + '/' + config.database.name;

module.exports = filter => {
    return new Promise((resolve, reject) => {

        mongoClient.connect(url, (err, db) => {
            console.log('err',err);
            const collection = db.collection(config.database.collectionName);

            collection.findOne(filter, (err, retrievedItem) => {
                if (err !== null) {
                    reject(Error(err));
                } else {
                    resolve(retrievedItem);
                }
                db.close();
            })
        });
    });
};
