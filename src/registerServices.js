'use strict';

const modules = [
    require('./registration'),
    require('./heartbeat'),
    require('./login')
];

module.exports = registerServices;

function registerServices(server) {
    modules.forEach(function (mod) {
        mod.registerIn(server);
    });
}
