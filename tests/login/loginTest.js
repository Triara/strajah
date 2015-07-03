'use strict';

const mockery = require('mockery'),
    should = require('chai').should(),
    q = require('q'),
    sinon = require('sinon');
require('chai').should();


describe('Login response code', () => {
    it('must call the next function', () => {
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

        promise.then(() => {
            nextMock.verify();
        });
    });

    it('must send back a response', () => {
        const request = mockRequest(),
            response = mockResponse();
        let responseSpy = sinon.spy(response, 'json');

        let deferred = q.defer();
        let promise = deferred.promise;

        let storageStub = sinon.stub();
        storageStub.returns(promise);

        let loginMiddleware = createLoginMiddleware(storageStub);
        loginMiddleware(request, response, () => {
        });

        let fulfilledPromise = promise.then(() => {
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

    it('if no customer is returned a 401 Unauthorized is sent back', () => {
        const request = mockRequest(),
            response = mockResponse();
        let responseSpy = sinon.spy(response, 'send');

        let deferred = q.defer();
        let promise = deferred.promise;

        let storageStub = sinon.stub();
        storageStub.returns(promise);

        let loginMiddleware = createLoginMiddleware(storageStub);
        loginMiddleware(request, response, () => {
        });

        const fulfilledPromise = promise.then(() => {
            responseSpy.calledOnce.should.be.true;

            const statusCode = responseSpy.args[0][0];
            should.exist(statusCode);
            statusCode.should.deep.equal(401);

            const body = responseSpy.args[0][1];
            should.not.exist(body);
        });

        deferred.resolve(null);

        return fulfilledPromise;
    });

    afterEach(() => {
        mockery.deregisterAll();
        mockery.disable();
    });
});

describe('Login response body', () => {
    it('has an accessToken property', () => {
        const request = mockRequest(),
            response = mockResponse();
        let responseSpy = sinon.spy(response, 'json');

        let deferred = q.defer();
        let promise = deferred.promise;

        let storageStub = sinon.stub();
        storageStub.returns(promise);

        let loginMiddleware = createLoginMiddleware(storageStub);
        loginMiddleware(request, response, () => {
        });

        let fulfilledPromise = promise.then(() => {
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

    afterEach(() => {
        mockery.deregisterAll();
        mockery.disable();
    });
});

describe('Login for registered customers with correct passwords', () => {
    it('Return a 401 if password is incorrect', () => {
        const request = mockRequest(),
            response = mockResponse();

        let deferred = q.defer();
        let promise = deferred.promise;

        let storageStub = sinon.stub();
        storageStub.returns(promise);

        let responseSpy = sinon.spy(response, 'send');

        const loginMiddleware = createLoginMiddleware(storageStub);
        loginMiddleware(request, response, () => {
        });

        const fulfilledPromise = promise.then(() => {
            const statusCode = responseSpy.args[0][0];
            statusCode.should.deep.equal(401);
        });

        const storageResponse = [
            {
                name: 'User1',
                password: 'Incorrect password'
            }
        ];
        deferred.resolve(storageResponse);

        return fulfilledPromise;
    });

    afterEach(() => {
        mockery.deregisterAll();
        mockery.disable();
    });
});

function mockRequest() {
    return {
        params: {},
        body: {
            name: 'User1',
            password: '123Password'
        }
    };
}

function createStorageResponse(request) {
    return {
        name: request.body.name,
        password: request.body.password
    };
}

function mockResponse() {
    return {
        json: () => {
        },
        send: () => {
        }
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