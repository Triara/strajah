'use strict';

const mockery = require('mockery'),
    should = require('chai').should(),
    q = require('q'),
    sinon = require('sinon');
require('chai').should();


describe('Login route', () => {
    it('must call the next function', () => {
        const request = mockRequest('username', 'pass123'),
            response = mockResponse();

        let deferred = q.defer();
        let promise = deferred.promise;

        let retrieveFromStorageStub = sinon.stub();
        retrieveFromStorageStub.returns(promise);

        let nextMock = sinon.mock();
        nextMock.once();

        const loginMiddleware = createLoginMiddleware(retrieveFromStorageStub);
        loginMiddleware(request, response, nextMock);

        deferred.resolve(createStorageResponse('username', 'pass123'));

        return promise.then(() => {
            nextMock.verify();
        });
    });

    it('must send back a response', done => {
        const request = mockRequest('username', 'pass123'),
            response = mockResponse();
        let responseSpy = sinon.spy(response, 'json');

        let deferred = q.defer();
        let promise = deferred.promise;

        let retrieveFromStorageStub = sinon.stub();
        retrieveFromStorageStub.returns(promise);

        const loginMiddleware = createLoginMiddleware(retrieveFromStorageStub);
        loginMiddleware(request, response, testChecks);

        deferred.resolve(createStorageResponse('username', 'pass123'));

        function testChecks () {
            responseSpy.calledOnce.should.equal(true);

            let statusCode = responseSpy.args[0][0];
            should.exist(statusCode);
            statusCode.should.deep.equal(200);

            let body = responseSpy.args[0][1];
            should.exist(body);
            done();
        }
    });

    it('if no customer is returned a 401 Unauthorized is sent back', done => {
        const request = mockRequest('username', 'pass123'),
            response = mockResponse();
        let responseSpy = sinon.spy(response, 'send');

        let deferred = q.defer();
        let promise = deferred.promise;

        let retrieveFromStorageStub = sinon.stub();
        retrieveFromStorageStub.returns(promise);

        const loginMiddleware = createLoginMiddleware(retrieveFromStorageStub);
        loginMiddleware(request, response, testChecks);

        deferred.resolve(null);

        function testChecks() {
            responseSpy.calledOnce.should.equal(true);

            const statusCode = responseSpy.args[0][0];
            should.exist(statusCode);
            statusCode.should.deep.equal(401);

            const body = responseSpy.args[0][1];
            should.not.exist(body);
            done();
        }
    });

    it('400 (bad request) if authorization header is not a of type basic', done => {
        const response = mockResponse();
        let responseSpy = sinon.spy(response, 'send');

        let request = mockRequest('username', 'pass123');
        request.headers.Authorization = 'Some other type';

        let deferred = q.defer();
        let promise = deferred.promise;

        let retrieveFromStorageStub = sinon.stub();
        retrieveFromStorageStub.returns(promise);

        const loginMiddleware = createLoginMiddleware(retrieveFromStorageStub);
        loginMiddleware(request, response, testChecks);

        deferred.resolve(null);

        function testChecks() {
            responseSpy.calledOnce.should.equal(true);

            const statusCode = responseSpy.args[0][0];
            should.exist(statusCode);
            statusCode.should.deep.equal(400);
            done();
        }
    });

    afterEach(() => {
        mockery.deregisterAll();
        mockery.disable();
    });
});

describe('Login for registered customers with correct passwords', () => {
    it('has an accessToken property', done => {
        const request = mockRequest('username', 'pass123'),
            response = mockResponse();
        let responseSpy = sinon.spy(response, 'json');

        let deferred = q.defer();
        let promise = deferred.promise;

        let retrieveFromStorageStub = sinon.stub();
        retrieveFromStorageStub.returns(promise);

        const loginMiddleware = createLoginMiddleware(retrieveFromStorageStub);
        loginMiddleware(request, response, testChecks);

        deferred.resolve(createStorageResponse('username', 'pass123'));

        function testChecks() {
            responseSpy.calledOnce.should.equal(true);

            let statusCode = responseSpy.args[0][0];
            should.exist(statusCode);
            statusCode.should.deep.equal(200);

            let body = responseSpy.args[0][1];
            should.exist(body);
            body.should.include.keys('accessToken');
            done();
        }
    });

    it('Return a 401 if password is incorrect', done => {
        const request = mockRequest('username', 'pass123'),
            response = mockResponse();

        let deferred = q.defer();
        let promise = deferred.promise;

        let retrieveFromStorageStub = sinon.stub();
        retrieveFromStorageStub.returns(promise);

        let responseSpy = sinon.spy(response, 'send');

        const loginMiddleware = createLoginMiddleware(retrieveFromStorageStub);
        loginMiddleware(request, response, testChecks);

        const storageResponse = [
            {
                name: 'User1',
                password: 'Incorrect password'
            }
        ];
        deferred.resolve(storageResponse);

        function testChecks() {
            const statusCode = responseSpy.args[0][0];
            statusCode.should.deep.equal(401);
            done();
        }
    });

    afterEach(() => {
        mockery.deregisterAll();
        mockery.disable();
    });
});

function mockRequest(name, password) {
    const basicAuthorization = new Buffer(name + ':' + password).toString('base64');
    return {
        params: {},
        headers: {
            'Authorization': 'Basic ' + basicAuthorization
        },
        header: headerName => {
            return this.headers[headerName];
        }
    };
}

function createStorageResponse(name, password) {
    return {
        name: name,
        password: password
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