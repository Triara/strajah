'use strict';

const config = require('../../src/config.js');

module.exports = {
    'publicPort': (process.env.PUBLIC_PORT) ? process.env.PUBLIC_PORT : config.publicPort,
    'publicHost': (process.env.PUBLIC_HOST) ? process.env.PUBLIC_HOST : 'http://localhost'
};
