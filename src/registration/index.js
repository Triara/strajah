'use strict';

const register = require('./registration.js');

module.exports = {
    registerIn: registerIn
};

function registerIn(server) {
    server.post('/auth/users', register)
}
