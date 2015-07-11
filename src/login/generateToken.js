'use strict';

const ciphertoken = require('ciphertoken'),
    config = require('../config');

const accessTokenCreator = ciphertoken({
    cipherKey: config.tokens.cipherKey,
    firmKey: config.tokens.firmKey
});

module.exports = username => {
    return accessTokenCreator.create.userId(username).encode().token;
};
