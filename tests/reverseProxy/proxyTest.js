'use strict';

const should = require('chai').should(),
    sinon = require('sinon'),
    proxyConfig = require('../../src/reverseProxy/proxyConfig.js'),
    mockery = require('mockery'),
    _ = require('lodash');


describe('Reverse proxy', () => {
    it('must call the next function', done => {
        const request = mockRequest(),
            response = mockResponse();

        let nextMock = sinon.mock();
        nextMock.once();

        const requestStub = (options, callback) => {
            callback();
        };

        const proxyMiddleware = _.partial(createProxyMiddleware(requestStub, createDecodeTokenStub('Ironman')), proxyConfig);
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

        const proxyMiddleware = _.partial(createProxyMiddleware(requestStub, createDecodeTokenStub('Ironman')), proxyConfigWithValidPath);
        proxyMiddleware(request, response, testChecks);

        function testChecks() {
            const expectedURL = proxyConfigWithValidPath.protectedServer.host + ':' + proxyConfigWithValidPath.protectedServer.port + request.url;
            usedOptionsForRequest.url.should.equal(expectedURL);

            usedOptionsForRequest.body.should.equal(request.body);
            usedOptionsForRequest.method.should.equal(request.method);
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

        const proxy = createProxyMiddleware(requestStub, createDecodeTokenStub('Ironman'));

        const proxyMiddleware = _.partial(proxy, proxyConfigWithValidPath);
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

        const proxyMiddleware = _.partial(createProxyMiddleware(requestStub, createDecodeTokenStub('Ironman')), proxyConfigWithInvalidPath);
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

        let proxyConfigWithValidPath = _.cloneDeep(proxyConfig);
        proxyConfigWithValidPath.paths[0].path = request.url;

        const proxyMiddleware = _.partial(createProxyMiddleware(requestMock, createDecodeTokenStub('Ironman')), proxyConfigWithValidPath);
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

        const proxyMiddleware = _.partial(createProxyMiddleware(requestMock, createDecodeTokenStub('Ironman')), proxyConfigWithInvalidPath);
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

        let proxyConfigWithInvalidPath = _.cloneDeep(proxyConfig);
        proxyConfigWithInvalidPath.paths[0].path = request.url;

        let requestMock = sinon.mock();

        const proxyMiddleware = _.partial(createProxyMiddleware(requestMock, createDecodeTokenStub('Ironman')), proxyConfigWithInvalidPath);
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

describe('Reverse proxy includes a header with the username', () => {
    it('Should include the username for whom the token was created', done => {
        const response = mockResponse(),
            request = mockRequest();

        const userName = 'Arnold';
        const decodeTokenStub = createDecodeTokenStub(userName);

        let usedOptionsForRequest = {};
        const requestStub = (options, callback) => {
            usedOptionsForRequest = options;
            callback();
        };

        let proxyConfigWithValidPath = _.cloneDeep(proxyConfig);
        proxyConfigWithValidPath.paths[0].path = request.url;


        const proxyMiddleware = _.partial(createProxyMiddleware(requestStub, decodeTokenStub), proxyConfigWithValidPath);
        proxyMiddleware(request, response, testChecks);


        function testChecks() {
            usedOptionsForRequest.headers.should.include.keys('Authorization');
            usedOptionsForRequest.headers.Authorization.should.equal('User ' + userName);
            done();
        }
    });

    it('Should return a 401 if it was not possible to decode token', done => {
        const response = mockResponse(),
            request = mockRequest();
        let responseSpy = sinon.spy(response, 'send');

        const decodeTokenStub = () => {
            return {
                error: 'Something bad happened'
            }
        };


        const requestStub = (options, callback) => {
            callback();
        };

        let proxyConfigWithValidPath = _.cloneDeep(proxyConfig);
        proxyConfigWithValidPath.paths[0].path = request.url;


        const proxyMiddleware = _.partial(createProxyMiddleware(requestStub, decodeTokenStub), proxyConfigWithValidPath);
        proxyMiddleware(request, response, testChecks);


        function testChecks() {
            responseSpy.calledOnce.should.equal(true);
            responseSpy.firstCall.args[0].should.equal(401);
            done();
        }
    });

    afterEach(() => {
        mockery.deregisterAll();
        mockery.disable();
    });
});


function createProxyMiddleware(requestMock, decodeTokenStub) {
    mockery.registerMock('request', requestMock);
    mockery.registerMock('./decodeToken', decodeTokenStub);

    mockery.enable({
        useCleanCache: true,
        warnOnReplace: false,
        warnOnUnregistered: false
    });

    return require('../../src/reverseProxy/proxy.js');
}


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

function createDecodeTokenStub(username) {
    return () => {
        return {
            userId: username,
            expiresAtTimestamp: 3282309
        }
    }
}
