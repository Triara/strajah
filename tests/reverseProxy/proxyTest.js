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

    it('should forward requests to protected paths', done => {
        const request = mockRequest(),
            response = mockResponse();

        let proxyConfigWithValidPath = _.cloneDeep(proxyConfig);
        proxyConfigWithValidPath.paths[0].path = request.url;


        let usedOptionsForRequest;
        const requestStub = (options, callback) => {
            usedOptionsForRequest = options;
            callback();
        };

        const proxyMiddleware = _.partial(createProxyMiddleware(requestStub), proxyConfigWithValidPath);
        proxyMiddleware(request, response, testChecks);

        function testChecks() {

            const expectedURL = proxyConfigWithValidPath.protectedServer.host + ':' + proxyConfigWithValidPath.protectedServer.port + request.url;
            usedOptionsForRequest.url.should.deep.equal(expectedURL);

            usedOptionsForRequest.body.should.deep.equal(request.body);
            usedOptionsForRequest.method.should.deep.equal(request.method);
            done();
        }
    });

    it('protected paths can be regexp', done => {
        const response = mockResponse();
        let request = mockRequest();

        request.url = 'pppppp123';
        const regexpAsProtectedPath = /p*123/;

        let proxyConfigWithValidPath = _.cloneDeep(proxyConfig);
        proxyConfigWithValidPath.paths[0].path = regexpAsProtectedPath;

        let usedOptionsForRequest;
        const requestStub = (options, callback) => {
            usedOptionsForRequest = options;
            callback();
        };

        const proxy = createProxyMiddleware(requestStub);

        let proxyMiddleware = _.partial(proxy, proxyConfigWithValidPath);
        proxyMiddleware(request, response, testChecks);

        function testChecks () {
            const expectedURL = proxyConfigWithValidPath.protectedServer.host + ':' + proxyConfigWithValidPath.protectedServer.port + request.url;
            usedOptionsForRequest.url.should.deep.equal(expectedURL);

            usedOptionsForRequest.body.should.deep.equal(request.body);
            usedOptionsForRequest.method.should.deep.equal(request.method);
            done();
        }
    });

    it('should not forward not protected paths', done => {
        const request = mockRequest(),
            response = mockResponse();
        let responseSpy = sinon.spy(response, 'send');

        let proxyConfigWithInvalidPath = _.cloneDeep(proxyConfig);
        proxyConfigWithInvalidPath.paths[0].path = request.url + '-invalid';

        const requestStub = (options, callback) => {
            callback();
        };

        const proxyMiddleware = _.partial(createProxyMiddleware(requestStub), proxyConfigWithInvalidPath);
        proxyMiddleware(request, response, testChecks);

        function testChecks () {
            const statusCode = responseSpy.args[0][0];
            should.exist(statusCode);
            statusCode.should.deep.equal(403);
            done();
        }
    });

    it('should not forward to protected paths if no \'Authorization\' header is provided', done => {
        const response = mockResponse();
        let responseSpy = sinon.spy(response, 'send');

        let request = mockRequest();
        delete request.headers.Authorization;

        let requestMock = sinon.mock();

        let proxyConfigWithInvalidPath = _.cloneDeep(proxyConfig);
        proxyConfigWithInvalidPath.paths[0].path = request.url;

        const proxyMiddleware = _.partial(createProxyMiddleware(requestMock), proxyConfigWithInvalidPath);
        proxyMiddleware(request, response, testChecks);

        function testChecks () {
            requestMock.called.should.equal(false);
            let statusCode = responseSpy.args[0][0];
            should.exist(statusCode);
            statusCode.should.deep.equal(401);
            done();
        }
    });

    it('should not forward to protected paths if no bearer token is provided', done => {
        const response = mockResponse();
        let responseSpy = sinon.spy(response, 'send');

        let request = mockRequest();
        request.headers.Authorization = 'Bearer';

        let requestMock = sinon.mock();

        let proxyConfigWithInvalidPath = _.cloneDeep(proxyConfig);
        proxyConfigWithInvalidPath.paths[0].path = request.url;

        const proxyMiddleware = _.partial(createProxyMiddleware(requestMock), proxyConfigWithInvalidPath);
        proxyMiddleware(request, response, testChecks);

        function testChecks () {
            requestMock.called.should.equal(false);
            let statusCode = responseSpy.args[0][0];
            should.exist(statusCode);
            statusCode.should.deep.equal(401);
            done();
        }
    });

    it('should not forward to protected paths if other type of authorization is provided', done => {
        const response = mockResponse();
        let responseSpy = sinon.spy(response, 'send');

        let request = mockRequest();
        request.headers.Authorization = 'Basic 73290128932';

        let requestMock = sinon.mock();

        let proxyConfigWithInvalidPath = _.cloneDeep(proxyConfig);
        proxyConfigWithInvalidPath.paths[0].path = request.url;

        const proxyMiddleware = _.partial(createProxyMiddleware(requestMock), proxyConfigWithInvalidPath);
        proxyMiddleware(request, response, testChecks);

        function testChecks () {
            requestMock.called.should.equal(false);
            let statusCode = responseSpy.args[0][0];
            should.exist(statusCode);
            statusCode.should.deep.equal(401);
            done();
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
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + '4Nlw14SGIPBbzaDLGrri3U5Uf7IPomxFfIT-0wRs6HSbfkf3YnIedTHOyjbvseF-9U1nR3u8XbnB0bDsOm5W7zV6db7WS-J3uaWaenq_9ritUjVs0ymxhLeIljntPCyhBbpIu9-szun5G93NuOt6zQ'
        },
        header: headerName => {
            return this.headers[headerName];
        }
    };
}

function mockResponse() {
    return {
        send: () => {}
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
