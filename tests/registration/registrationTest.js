'use strict';

const should = require('chai').should(),
    q = require('q'),
    sinon = require('sinon'),
    mockery = require('mockery');


describe('Registration route should be available', function () {
    it('Should call the next function', function () {
        const request = mockRequest(),
            response = mockResponse();

        let deferred = q.defer();
        let promise = deferred.promise;

        let retrieveFromStorageStub = sinon.stub();
        retrieveFromStorageStub.returns(promise);

        let storageSpy = sinon.spy();

        let nextMock = sinon.mock();
        nextMock.once();

        let registrationMiddleware = createRegistrationMiddleware(retrieveFromStorageStub, storageSpy);
        registrationMiddleware(request, response, nextMock);

        deferred.resolve();

        promise.then(function () {
            nextMock.verify();
        });
    });

    it('Should return 201 created and a body', function () {
        const request = mockRequest(),
            response = mockResponse();

        let deferred = q.defer();
        let promise = deferred.promise;

        let retrieveFromStorageStub = sinon.stub();
        retrieveFromStorageStub.returns(promise);

        let storageSpy = sinon.spy();
        let responseSpy = sinon.spy(response, 'json');

        let registrationMiddleware = createRegistrationMiddleware(retrieveFromStorageStub, storageSpy);
        registrationMiddleware(request, response, function () {});

        let fulfilledPromise = promise.then(function () {
            responseSpy.calledOnce.should.be.true;

            let statusCode = responseSpy.args[0][0];
            should.exist(statusCode);
            statusCode.should.deep.equal(201);

            let body = responseSpy.args[0][1];
            should.exist(body);
        });

        deferred.resolve();

        return fulfilledPromise;
    });

    it('Should return 401 when a customer exists with the same name', function () {
        const request = mockRequest(),
            response = mockResponse();

        let deferred = q.defer();
        let promise = deferred.promise;

        let retrieveFromStorageStub = sinon.stub();
        retrieveFromStorageStub.returns(promise);

        let storageSpy = sinon.spy();
        let responseSpy = sinon.spy(response, 'json');

        let registrationMiddleware = createRegistrationMiddleware(retrieveFromStorageStub, storageSpy);
        registrationMiddleware(request, response, function () {});

        let fulfilledPromise = promise.then(function () {
            let statusCode = responseSpy.args[0][0];
            statusCode.should.deep.equal(401);
        });

        let storageResponse = [
            {
                name: 'User1'
            }
        ];
        deferred.resolve(storageResponse);

        return fulfilledPromise;
    });

    it('Should store the customers and passwords', function () {
        const request = mockRequest(),
            response = mockResponse();

        let deferred = q.defer();
        let promise = deferred.promise;

        let retrieveFromStorageStub = sinon.stub();
        retrieveFromStorageStub.returns(promise);

        let storageMock = sinon.mock();

        let registrationMiddleware = createRegistrationMiddleware(retrieveFromStorageStub, storageMock);
        registrationMiddleware(request, response, function () {});

        deferred.resolve();
        return promise.then(function () {
            storageMock.called.should.be.true;
            storageMock.args[0][0].should.deep.equal({name: request.body.name, password: request.body.password});
        });
    });

    it('Should return 400 when missing \'name\' property in the body request', function () {
        const request = mockRequest();
        delete request.body.name;

        const response = mockResponse();

        let deferred = q.defer();
        let promise = deferred.promise;

        let retrieveFromStorageStub = sinon.stub();
        retrieveFromStorageStub.returns(promise);

        let storageSpy = sinon.spy();
        let responseSpy = sinon.spy(response, 'json');

        let registrationMiddleware = createRegistrationMiddleware(retrieveFromStorageStub, storageSpy);
        registrationMiddleware(request, response, function () {});

        let fulfilledPromise = promise.then(function () {
            responseSpy.calledOnce.should.be.true;

            let statusCode = responseSpy.args[0][0];
            should.exist(statusCode);
            statusCode.should.deep.equal(400);

            let body = responseSpy.args[0][1];
            should.exist(body);
        });

        deferred.resolve();

        return fulfilledPromise;
    });

    it('Should return 400 when missing \'password\' property in the body request', function () {
        const request = mockRequest();
        delete request.body.password;

        const response = mockResponse();

        let deferred = q.defer();
        let promise = deferred.promise;

        let retrieveFromStorageStub = sinon.stub();
        retrieveFromStorageStub.returns(promise);

        let storageSpy = sinon.spy();
        let responseSpy = sinon.spy(response, 'json');

        let registrationMiddleware = createRegistrationMiddleware(retrieveFromStorageStub, storageSpy);
        registrationMiddleware(request, response, function () {});

        let fulfilledPromise = promise.then(function () {
            responseSpy.calledOnce.should.be.true;

            let statusCode = responseSpy.args[0][0];
            should.exist(statusCode);
            statusCode.should.deep.equal(400);

            let body = responseSpy.args[0][1];
            should.exist(body);
        });

        deferred.resolve();

        return fulfilledPromise;
    });

    afterEach(function () {
        mockery.deregisterAll();
        mockery.disable();
    });
});

function mockRequest () {
    return {
        params: {},
        body: {
            name: 'User1',
            password: '123Password'
        }
    };
}
function mockResponse() {
    return {
        json: function () {}
    };
}

function createRegistrationMiddleware(retrieveFromStorageStub, storageMock) {
    mockery.registerMock('./../storage/retrieveFromStorage.js', retrieveFromStorageStub);
    mockery.registerMock('./../storage/persistOnStorage.js', storageMock);

    mockery.enable({
        useCleanCache: true,
        warnOnReplace: false,
        warnOnUnregistered: false
    });

    return require('../../src/registration/registration.js');
}
