'use strict';

const modules = [
    require('./registration'),
    require('./heartbeat'),
    require('./users'),
    require('./login')
];

const reverseProxy = require('./reverseProxy');


module.exports = registerServices;

function registerServices(server, proxyCustomConfig) {
    modules.forEach(module => {
        module.registerIn(server);
    });
    reverseProxy.registerIn(server, proxyCustomConfig);
}
