'use strict';

module.exports = {
    publishValue: publishValue,
    getValue: getValue,
    reset: reset
};


let sandbox = [];

function publishValue (data) {
    sandbox.push(data);
}

function getValue () {
    return sandbox;
}

function reset () {
    sandbox = []
}
