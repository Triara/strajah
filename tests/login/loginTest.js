'use strict';

const mockery = require('mockery'),
    should = require('chai').should(),
    q = require('q'),
    sinon = require('sinon');
require('chai').should();


describe('Login response code', function(){
    it('must call the next function', function(){
        const request = mockRequest(),
            response = mockResponse();

        let deferred = q.defer();
        let promise = deferred.promise;

        let storageStub = sinon.stub();
        storageStub.returns(promise);

        let nextMock = sinon.mock();
        nextMock.once();

        let loginMiddleware = createLoginMiddleware(storageStub);
        loginMiddleware(request, response, nextMock);

        deferred.resolve(createStorageResponse(request));

        promise.then(function () {
            nextMock.verify();
        });
    });

    it('must send back a response', function(){
        const request = mockRequest(),
            response = mockResponse();
        let responseSpy = sinon.spy(response, 'json');

        let deferred = q.defer();
        let promise = deferred.promise;

        let storageStub = sinon.stub();
        storageStub.returns(promise);

        let loginMiddleware = createLoginMiddleware(storageStub);
        loginMiddleware(request, response, function () {});

        let fulfilledPromise = promise.then(function () {
            responseSpy.calledOnce.should.be.true;

            let statusCode = responseSpy.args[0][0];
            should.exist(statusCode);
            statusCode.should.deep.equal(200);

            let body = responseSpy.args[0][1];
            should.exist(body);
        });

        deferred.resolve(createStorageResponse(request));

        return fulfilledPromise;
    });

    afterEach(function () {
        mockery.deregisterAll();
        mockery.disable();
    });
});

describe('Login response body', function () {
    it('has an accessToken property', function () {
        const request = mockRequest(),
            response = mockResponse();
        let responseSpy = sinon.spy(response, 'json');

        let deferred = q.defer();
        let promise = deferred.promise;

        let storageStub = sinon.stub();
        storageStub.returns(promise);

        let loginMiddleware = createLoginMiddleware(storageStub);
        loginMiddleware(request, response, function () {});

        let fulfilledPromise = promise.then(function () {
            responseSpy.calledOnce.should.be.true;

            let statusCode = responseSpy.args[0][0];
            should.exist(statusCode);
            statusCode.should.deep.equal(200);

            let body = responseSpy.args[0][1];
            should.exist(body);
            body.should.include.keys('accessToken');
        });

        deferred.resolve(createStorageResponse(request));

        return fulfilledPromise;
    });

    afterEach(function () {
        mockery.deregisterAll();
        mockery.disable();
    });
});

describe('Login for registered customers with correct passwords', function(){
    it('Return a 401 if password is incorrect', function(){
        const request = mockRequest(),
            response = mockResponse();

        let deferred = q.defer();
        let promise = deferred.promise;

        let storageStub = sinon.stub();
        storageStub.returns(promise);

        let responseSpy = sinon.spy(response, 'json');

        let loginMiddleware = createLoginMiddleware(storageStub);
        loginMiddleware(request, response, function(){});

        let fulfilledPromise = promise.then(function () {
            let statusCode = responseSpy.args[0][0];
            statusCode.should.deep.equal(401);
        });

        let storageResponse = [
            {
                name: 'User1',
                password: 'Incorrect password'
            }
        ];
        deferred.resolve(storageResponse);

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

function createStorageResponse(request) {
    return [
        {
            name: request.body.name,
            password: request.body.password
        }
    ]
}

function mockResponse() {
    return {
        json: function () {}
    };
}

function createLoginMiddleware(retrieveFromStorageStub) {
    mockery.registerMock('./../storage/retrieveFromStorage.js', retrieveFromStorageStub);

    mockery.enable({
        useCleanCache: true,
        warnOnReplace: false,
        warnOnUnregistered: false
    });

    return require('../../src/login/login.js');
}