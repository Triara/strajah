'use strict';

const _ = require('lodash'),
    serverInstance = require('../serverInstance.js'),
    protectedServer = require('../protectedServerStubby/protectedServer.js');


const World = function (callback) {

    let sandbox = {};

    callback({
        publishValue: publishValue,
        getValue: getValue,
        serverInstance: serverInstance,
        protectedServer: protectedServer
    });

    function publishValue(name, value) {
        sandbox[name] = value;
    }

    function getValue(name) {
        return sandbox[name];
    }
};

module.exports = () => {
    this.World = World;
};
