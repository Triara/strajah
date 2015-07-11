'use strict';

const modules = [
    require('./registration'),
    require('./heartbeat'),
    require('./users'),
    require('./login')
];

module.exports = registerServices;

function registerServices(server, customConfig) {
    modules.forEach(module => {
        module.registerIn(server);
    });
    const reverseProxy = require('./reverseProxy');
    reverseProxy.registerIn(server, customConfig);
}
