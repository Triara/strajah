'use strict';

const should = require('chai').should(),
    q = require('q'),
    sinon = require('sinon'),
    registrationMiddleware = require('../../src/registration/registration.js'),
    _ = require('lodash');


describe('Registration route should be available', function () {
    it('Should call the next function', function () {
        const request = mockRequest(),
            response = mockResponse();

        let deferred = q.defer();
        let promise = deferred.promise;

        let nextMock = sinon.mock();
        nextMock.once();

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

        let responseSpy = sinon.spy(response, 'json');

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
});

function mockRequest () {
    return {
        params: {}
    };
}
function mockResponse() {
    return {
        json: function () {}
    };
}