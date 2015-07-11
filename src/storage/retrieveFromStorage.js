'use strict';

const mongoClient = require('mongodb').MongoClient,
    config = require('../config.js');

const url = config.database.uri;

module.exports = filter => {
    return new Promise((resolve, reject) => {

        mongoClient.connect(url, (err, db) => {
            if(err) {
                return reject(Error(err));
            }

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
