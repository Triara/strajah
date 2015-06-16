'use strict';

const should = require('chai').should(),
    mockery = require('mockery');


describe('Retrieve all entries from storage', () => {
    it('Should return a promise', () => {
        let databaseStub = {
            getValue: () => {
                return 'storedData';
            }
        };
        const retrieveFromStorage = createRetrieveFromStorage(databaseStub);
        const promise = retrieveFromStorage();

        should.exist(promise);
    });

    it('Should return retrieved data' , done => {
        let storedData = 'store me';
        let databaseStub = {
            getValue: () => {
                return storedData;
            }
        };

        let retrieveFromStorage = createRetrieveFromStorage(databaseStub);
        retrieveFromStorage().then(retrievedData => {
            retrievedData.should.not.equal(undefined);
            retrievedData.should.deep.equal(storedData);
            done();
        });
    });

    afterEach(() => {
        mockery.deregisterAll();
        mockery.disable();
    });
});


function createRetrieveFromStorage (databaseStub) {
    mockery.registerMock('./ancientStorage.js', databaseStub);

    mockery.enable({
        useCleanCache: true,
        warnOnReplace: false,
        warnOnUnregistered: false
    });

    return require('../../src/storage/retrieveFromStorage.js');
}
