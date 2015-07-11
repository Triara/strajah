'use strict';

const _ = require('lodash');

module.exports = {
    registerIn: registerIn
};

function registerIn (server, customCofig) {
    const reverseProxy = require('./proxy.js')(customCofig);
    server.post('/(.*)/', reverseProxy);
    server.get('/(.*)/', reverseProxy);
}
