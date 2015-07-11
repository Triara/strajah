'use strict';

const should = require('chai').should(),
    sinon = require('sinon'),
    config = require('../../src/config.js'),
    mockery = require('mockery'),
    _ = require('lodash');


describe('Reverse proxy', () => {
    it('must call the next function', done => {
        const request = mockRequest(),
            response = mockResponse();

        let nextMock = sinon.mock();
        nextMock.once();

        const requestStub = (options, callback) => {
            callback(null, {statusCode: 200});
        };

        const proxyMiddleware = createProxyMiddleware(requestStub, createDecodeTokenStub('Ironman'), config);
        proxyMiddleware(request, response, done);
    });

    it('should forward requests to protected paths', done => {
        const request = mockRequest(),
            response = mockResponse();

        let configWithValidPath = _.cloneDeep(config);
        configWithValidPath.proxy.paths[0].path = request.url;

        let usedOptionsForRequest;
        const requestStub = (options, callback) => {
            usedOptionsForRequest = options;
            callback(null, {statusCode: 200});
        };

        const proxyMiddleware = createProxyMiddleware(requestStub, createDecodeTokenStub('Ironman'), configWithValidPath);
        proxyMiddleware(request, response, testChecks);

        function testChecks() {
            const expectedURL = configWithValidPath.proxy.protectedServer.host + ':' + configWithValidPath.proxy.protectedServer.port + request.url;
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

        let configWithValidPath = _.cloneDeep(config);
        configWithValidPath.proxy.paths[0].path = regexpAsProtectedPath;

        let usedOptionsForRequest;
        const requestStub = (options, callback) => {
            usedOptionsForRequest = options;
            callback(null, {statusCode: 200});
        };

        const proxy = createProxyMiddleware(requestStub, createDecodeTokenStub('Ironman'), configWithValidPath);
        proxy(request, response, testChecks);

        function testChecks () {
            const expectedURL = configWithValidPath.proxy.protectedServer.host + ':' + configWithValidPath.proxy.protectedServer.port + request.url;
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

        let configWithInvalidPath = _.cloneDeep(config);
        configWithInvalidPath.proxy.paths[0].path = request.url + '-invalid';

        const requestStub = (options, callback) => {
            callback(null, {statusCode: 200});
        };

        const proxyMiddleware = createProxyMiddleware(requestStub, createDecodeTokenStub('Ironman'), configWithInvalidPath);
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
        let responseSpy = sinon.spy(response, 'json');

        let request = mockRequest();
        delete request.headers.Authorization;

        let requestMock = sinon.mock();

        let configWithValidPath = _.cloneDeep(config);
        configWithValidPath.proxy.paths[0].path = request.url;

        const proxyMiddleware = createProxyMiddleware(requestMock, createDecodeTokenStub('Ironman'), configWithValidPath);
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
        let responseSpy = sinon.spy(response, 'json');

        let request = mockRequest();
        request.headers.Authorization = 'Bearer';

        let requestMock = sinon.mock();

        let configWithInvalidPath = _.cloneDeep(config);
        configWithInvalidPath.proxy.paths[0].path = request.url;

        const proxyMiddleware = createProxyMiddleware(requestMock, createDecodeTokenStub('Ironman'), configWithInvalidPath);
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
        let responseSpy = sinon.spy(response, 'json');

        let request = mockRequest();
        request.headers.Authorization = 'Basic 73290128932';

        let configWithInvalidPath = _.cloneDeep(config);
        configWithInvalidPath.proxy.paths[0].path = request.url;

        let requestMock = sinon.mock();

        const proxyMiddleware = createProxyMiddleware(requestMock, createDecodeTokenStub('Ironman'), configWithInvalidPath);
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
            callback(null, {statusCode: 200});
        };

        let configWithValidPath = _.cloneDeep(config);
        configWithValidPath.proxy.paths[0].path = request.url;


        const proxyMiddleware = createProxyMiddleware(requestStub, decodeTokenStub, configWithValidPath);
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
        let responseSpy = sinon.spy(response, 'json');

        const decodeTokenStub = () => {
            return {
                error: 'Something bad happened'
            }
        };


        const requestStub = (options, callback) => {
            callback();
        };

        let configWithValidPath = _.cloneDeep(config);
        configWithValidPath.proxy.paths[0].path = request.url;


        const proxyMiddleware = createProxyMiddleware(requestStub, decodeTokenStub, configWithValidPath);
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



describe('the reverse proxy returns the response from the protected server', () => {
    it('the status code & body should be returned back', done => {
        const request = mockRequest(),
            response = mockResponse();
        let responseSpy = sinon.spy(response, 'send');

        let configWithValidPath = _.cloneDeep(config);
        configWithValidPath.proxy.paths[0].path = request.url;

        const  responseStub = {
            statusCode: 222
        };
        const bodyStub = "{\"Something\": \"in here\"}";

        const requestStub = (options, callback) => {
            callback(null, responseStub, bodyStub);
        };

        const proxyMiddleware = createProxyMiddleware(requestStub, createDecodeTokenStub('Ironman'), configWithValidPath);
        proxyMiddleware(request, response, testChecks);


        function testChecks() {
            responseSpy.calledOnce.should.equal(true);
            responseSpy.firstCall.args[0].should.equal(responseStub.statusCode);
            responseSpy.firstCall.args[1].should.deep.equal(bodyStub);
            done();
        }
    });

    afterEach(() => {
        mockery.deregisterAll();
        mockery.disable();
    });
});



function createProxyMiddleware(requestMock, decodeTokenStub, customConfig) {
    mockery.registerMock('request', requestMock);
    mockery.registerMock('./decodeToken', decodeTokenStub);

    mockery.enable({
        useCleanCache: true,
        warnOnReplace: false,
        warnOnUnregistered: false
    });

    return require('../../src/reverseProxy/proxy.js')(customConfig);
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
        send: () => {},
        json: () => {}
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
