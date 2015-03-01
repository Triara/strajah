'use strict';

const _ = require('lodash'),
    sinon = require('sinon'),
    mockery = require('mockery');
require('chai').should();

describe('Persist on storage', function () {
    it('Should be a function', function(){
        let databaseSpy = sinon.spy();
        let persistOnStorage = createPersistOnStorage(databaseSpy);

        _.isFunction(persistOnStorage).should.be.true;
    });

    it('Should call the db publishValue method', function () {
        let databaseStub = {
            publishValue: function () {}
        };

        let databaseSpy = sinon.spy(databaseStub, 'publishValue');

        let persistOnStorage = createPersistOnStorage(databaseStub);

        const dataToPersist = {some: 'data'};
        persistOnStorage(dataToPersist);

        databaseSpy.calledOnce.should.be.true;
        databaseSpy.args[0][0].should.deep.equal(dataToPersist);
    });

    afterEach(function () {
        mockery.deregisterAll();
        mockery.disable();
    });
});

function createPersistOnStorage (databaseStub) {
    mockery.registerMock('./ancientStorage.js', databaseStub);

    mockery.enable({
        useCleanCache: true,
        warnOnReplace: false,
        warnOnUnregistered: false
    });

    return require('../../src/storage/persistOnStorage.js');
}
