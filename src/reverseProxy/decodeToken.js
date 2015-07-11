'use strict';

const ciphertoken = require('ciphertoken'),
    _ = require('lodash'),
    config = require('../config');

const tokenDecoder = ciphertoken({
    cipherKey: config.tokens.cipherKey,
    firmKey: config.tokens.firmKey
});

module.exports = token => {
    const decodedToken = tokenDecoder.decode(token);

    if (!_.isUndefined(decodedToken.error)) {
        return {error: decodedToken.error};
    }

    return decodedToken.set;
};
