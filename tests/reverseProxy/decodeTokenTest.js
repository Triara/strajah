'use strict';

const should = require('chai').should(),
    sinon = require('sinon'),
    mockery = require('mockery'),
    _ = require('lodash');

describe('Decode tokens', () => {
    it('should return the token set when decoded correctly', () => {
        const username = 'some user';
        const expiresAtTimestamp = 63129812390;

        const cipherTokenStub = () => {
            return {
                decode: () => {
                    return {
                        set: {
                            userId: username,
                            expiresAtTimestamp: expiresAtTimestamp
                        }
                    }
                }
            }
        };

        const decodeToken = createDecodeToken(cipherTokenStub);

        const decodedToken = decodeToken('123abc');
        decodedToken.userId.should.equal(username);
        decodedToken.expiresAtTimestamp.should.equal(expiresAtTimestamp);
    });

    it('should return only the error if the token can not be decoded', () => {
        const error = {
            some: 'error happened'
        };

        const cipherTokenStub = () => {
            return {
                decode: () => {
                    return {
                        error: error
                    }
                }
            }
        };

        const decodeToken = createDecodeToken(cipherTokenStub);

        const decodedToken = decodeToken('123abc');
        decodedToken.error.should.deep.equal(error);
    });

    afterEach(() => {
        mockery.deregisterAll();
        mockery.disable();
    });
});

function createDecodeToken(ciphertokenStub) {
    mockery.registerMock('ciphertoken', ciphertokenStub);

    mockery.enable({
        useCleanCache: true,
        warnOnReplace: false,
        warnOnUnregistered: false
    });

    return require('../../src/reverseProxy/decodeToken.js');
}
