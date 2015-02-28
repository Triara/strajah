'use strict';

const modules = [
    require('./registration')
];

module.exports = registerServices;

function registerServices(server) {
    modules.forEach(function (mod) {
        mod.registerIn(server);
    });
}
