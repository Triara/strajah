'use strict';

const register = require('./registration.js');

module.exports = {
    registerIn: registerIn
};

function registerIn(server) {
    server.post('api/registration', register)
}
