'use strict';

const should = require('chai').should(),
    sinon = require('sinon'),
    mockery = require('mockery'),
    proxyConfig = require('../../src/reverseProxy/proxyConfig.js'),
    _ = require('lodash');
require('chai').should();


describe('Reverse proxy', () => {
    it('must call the next function', done => {
        const request = mockRequest(),
            response = mockResponse();

        let nextMock = sinon.mock();
        nextMock.once();

        const requestStub = (options, callback) => {
            callback();
        };

        let proxyMiddleware = _.partial(createProxyMiddleware(requestStub), proxyConfig);
        proxyMiddleware(request, response, done);
    });

    it('should forward requests to protected paths', () => {
        const request = mockRequest(),
            response = mockResponse();

        let requestMock = sinon.mock();

        let proxyConfigWithValidPath = _.cloneDeep(proxyConfig);
        proxyConfigWithValidPath.paths[0].path = request.url;

        const proxyMiddleware = _.partial(createProxyMiddleware(requestMock), proxyConfigWithValidPath);
        proxyMiddleware(request, response, testChecks);

        function testChecks() {
            requestMock.called.should.equal(true);

            const expectedURL = proxyConfigWithValidPath.protectedServer.host + ':' + proxyConfigWithValidPath.protectedServer.port + request.url;
            requestMock.args[0][0].url.should.deep.equal(expectedURL);

            requestMock.args[0][0].body.should.deep.equal(request.body);
            requestMock.args[0][0].method.should.deep.equal(request.method);
        }
    });

    it('protected paths can be regexp', () => {
        const response = mockResponse();
        let request = mockRequest();

        request.url = 'pppppp123';
        const regexpAsProtectedPath = /p*123/;

        let requestMock = sinon.mock();

        let proxyConfigWithValidPath = _.cloneDeep(proxyConfig);
        proxyConfigWithValidPath.paths[0].path = regexpAsProtectedPath;

        const proxy = createProxyMiddleware(requestMock);

        let proxyMiddleware = _.partial(proxy, proxyConfigWithValidPath);
        proxyMiddleware(request, response, testChecks);

        function testChecks () {
            requestMock.calledOnce.should.equal(true);

            const expectedURL = proxyConfigWithValidPath.protectedServer.host + ':' + proxyConfigWithValidPath.protectedServer.port + request.url;
            requestMock.args[0][0].url.should.deep.equal(expectedURL);

            requestMock.args[0][0].body.should.deep.equal(request.body);
            requestMock.args[0][0].method.should.deep.equal(request.method);
        }
    });

    it('should not forward not protected paths', () => {
        const request = mockRequest(),
            response = mockResponse();
        let responseSpy = sinon.spy(response, 'json');

        let requestMock = sinon.mock();

        let proxyConfigWithInvalidPath = _.cloneDeep(proxyConfig);
        proxyConfigWithInvalidPath.paths[0].path = request.url + '-invalid';

        const proxyMiddleware = _.partial(createProxyMiddleware(requestMock), proxyConfigWithInvalidPath);
        proxyMiddleware(request, response, testChecks);

        function testChecks () {
            requestMock.called.should.equal(false);
            let statusCode = responseSpy.args[0][0];
            should.exist(statusCode);
            statusCode.should.deep.equal(403);
        }
    });

    afterEach(() => {
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
        json: () => {}
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
