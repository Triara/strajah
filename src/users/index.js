'use strict';

const deleteUsers = require('./deleteUsers.js');

module.exports = {
    registerIn: registerIn
};

function registerIn(server) {
    server.del('/auth/users', deleteUsers)
}
