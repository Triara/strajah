'use strict';

const mockery = require('mockery'),
    should = require('chai').should(),
    sinon = require('sinon');

describe('Generate tokens', () => {
    it('should return tokens', () => {
        const falseToken = '123123abc';
        const ciphertokenMock = settings => {
            return {
                create: {
                    userId: () => {return this;},
                    encode: () => {return falseToken;}
                }
            }
        };

        mockery.registerMock('ciphertoken', ciphertokenMock);
        const generateToken = require('../../src/login/generateToken.js');

        should.exist(generateToken('user'));
    });
});

