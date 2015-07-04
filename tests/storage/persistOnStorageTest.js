'use strict';

const _ = require('lodash'),
    sinon = require('sinon'),
    config = require('../../src/config'),
    q = require('q'),
    mockery = require('mockery');
require('chai').should();

describe('Persist on storage', () => {
    it('Should return a promise', () => {
        let databaseStub = sinon.spy();

        const persistOnStorage = createPersistOnStorage(databaseStub);

        q.isPromiseAlike(persistOnStorage('persist something')).should.equal(true);
    });

    it('Should call the db publishValue method', () => {

        let usedCollectionName;
        let dataSentToPersist;
        const dbStub = {
            collection: collectionName => {
                usedCollectionName = collectionName;
                return {
                    insertOne: (dataToPersist, insertOneCallback) => {
                        dataSentToPersist = dataToPersist;
                        insertOneCallback(null);
                    }
                }
            }
        };

        let dbConnectedToUrl;
        const databaseStub = {
            MongoClient: {
                connect: (url, connectCallback) => {
                    dbConnectedToUrl = url;
                    connectCallback(null, dbStub)
                }
            }
        };

        let persistOnStorage = createPersistOnStorage(databaseStub);

        const dataToPersist = {some: 'data'};

        return persistOnStorage(dataToPersist).then(() => {
            dbConnectedToUrl.should.equal('mongodb://' + config.database.host + ':' + config.database.port + '/' + config.database.name + '?w=1');
            usedCollectionName.should.equal(config.database.collectionName);
            dataSentToPersist.should.deep.equal(dataToPersist);
        });
    });

    afterEach(() => {
        mockery.deregisterAll();
        mockery.disable();
    });
});

function createPersistOnStorage(databaseStub) {
    mockery.registerMock('mongodb', databaseStub);

    mockery.enable({
        useCleanCache: true,
        warnOnReplace: false,
        warnOnUnregistered: false
    });

    return require('../../src/storage/persistOnStorage.js');
}
