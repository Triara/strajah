'use strict';

const should = require('chai').should(),
    q = require('q'),
    sinon = require('sinon'),
    mockery = require('mockery'),
    proxyConfig = require('../../src/reverseProxy/proxyConfig.js'),
    _ = require('lodash');
require('chai').should();


describe('Protected paths', function () {
    it('must call the next function', function(){
        const request = mockRequest(),
            response = mockResponse();

        let deferred = q.defer();
        let promise = deferred.promise;

        let nextMock = sinon.mock();
        nextMock.once();

        let requestStub = function (options, callback) {
            callback();
        };

        let proxy = createProxyMiddleware(requestStub);

        let proxyMiddleware = _.partial(proxy, proxyConfig);
        proxyMiddleware(request, response, nextMock);

        deferred.resolve();

        return promise.then(function () {
            nextMock.verify();
        });
    });

    it('should forward requests to protected paths', function () {
        const request = mockRequest(),
            response = mockResponse();

        let deferred = q.defer();
        let promise = deferred.promise;

        let requestMock = sinon.mock();

        let proxyConfigWithValidPath = _.cloneDeep(proxyConfig);
        proxyConfigWithValidPath.paths[0].path = request.url;

        let proxy = createProxyMiddleware(requestMock);

        let proxyMiddleware = _.partial(proxy, proxyConfigWithValidPath);
        proxyMiddleware(request, response, function () {});

        deferred.resolve();
        return promise.then(function () {
            requestMock.called.should.be.true;
            requestMock.args[0][0].url.should.deep.equal(request.url);
            requestMock.args[0][0].body.should.deep.equal(request.body);
            requestMock.args[0][0].method.should.deep.equal(request.method);
        });
    });

    it('should not forward not protected paths', function () {
        const request = mockRequest(),
            response = mockResponse();
        let responseSpy = sinon.spy(response, 'json');

        let deferred = q.defer();
        let promise = deferred.promise;

        let requestMock = sinon.mock();

        let proxyConfigWithInvalidPath = _.cloneDeep(proxyConfig);
        proxyConfigWithInvalidPath.paths[0].path = request.url + '-invalid';

        let proxy = createProxyMiddleware(requestMock);

        let proxyMiddleware = _.partial(proxy, proxyConfigWithInvalidPath);
        proxyMiddleware(request, response, function () {});

        deferred.resolve();
        return promise.then(function () {
            requestMock.called.should.be.false;
            let statusCode = responseSpy.args[0][0];
            should.exist(statusCode);
            statusCode.should.deep.equal(403);
        });
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
        },
        url: '/api/some-uri',
        method: 'POST'
    };
}

function mockResponse() {
    return {
        json: function () {}
    };
}

function createProxyMiddleware(requestMock) {
    mockery.registerMock('request', requestMock);

    mockery.enable({
        useCleanCache: true,
        warnOnReplace: false,
        warnOnUnregistered: false
    });

    return require('../../src/reverseProxy/proxy.js');
}

