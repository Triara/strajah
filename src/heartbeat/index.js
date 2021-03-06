'use strict';

const makeHeartbeat = require('./heartbeat.js');

module.exports = {
    registerIn: registerIn
};

function registerIn (server) {
    server.get('/auth/heartbeat', makeHeartbeat);
}
