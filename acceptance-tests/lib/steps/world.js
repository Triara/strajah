'use strict';

const _ = require('lodash');

const World = function (callback) {

    let sandbox = {};

    callback({
        publishValue: publishValue,
        getValue: getValue
    });

    function publishValue(name, value) {
        if (_.isObject(sandbox[name]) && _.isObject(value)) {
            return sandbox[name] = _.assign(sandbox[name], value)
        }
        let newProperties = {};
        newProperties[name] = value;

        sandbox = _.assign(sandbox, newProperties);
    }

    function getValue(name) {
        return sandbox[name];
    }
};

module.exports = function () {
    this.World = World;
};
