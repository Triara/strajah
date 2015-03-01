'use strict';

const should = require('chai').should(),
    mockery = require('mockery');


describe('Retrieve all entries from storage', function () {
    it('Should return a promise', function () {
        let databaseStub = {
            getValue: function () {
                return 'storedData';
            }
        };
        let retrieveFromStorage = createRetrieveFromStorage(databaseStub);
        let promise = retrieveFromStorage();

        should.exist(promise);
    });

    it('Should return retrieved data' , function (done) {
        let storedData = 'store me';
        let databaseStub = {
            getValue: function () {
                return storedData;
            }
        };

        let retrieveFromStorage = createRetrieveFromStorage(databaseStub);
        retrieveFromStorage().then(function (retrievedData){
            retrievedData.should.not.be.undefined;
            retrievedData.should.deep.equal(storedData);
            done();
        });
    });

    afterEach(function () {
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
