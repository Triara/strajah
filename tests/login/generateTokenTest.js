'use strict';

const mockery = require('mockery'),
    should = require('chai').should(),
    sinon = require('sinon');

describe('Generate tokens', () => {
    beforeEach(() =>{
        mockery.enable({
            useCleanCache: true,
            warnOnReplace: false,
            warnOnUnregistered: false
        });
    });

    it('should return tokens', () => {
        const falseToken = '123123abc';
        const ciphertokenMock = settings => {
            return {
                create: {
                    userId: () => {return this;},
                    encode: () => {return {token: falseToken};}
                }
            }
        };

        mockery.registerMock('ciphertoken', ciphertokenMock);
        const generateToken = require('../../src/login/generateToken.js');

        const token = generateToken('user');
        should.exist(token);
        token.should.equal(falseToken);
    });

    afterEach(() => {
        mockery.deregisterAll();
        mockery.disable();
    });
});
