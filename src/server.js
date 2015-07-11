'use strict';

const restify = require('restify');
const _ = require('lodash');
const defaultConfig = require('./config.js');

module.exports = {
    create: create,
    start: start,
    stop: stop
};

function create(customConfig){
	customConfig = customConfig || {};
	_.defaults(customConfig, defaultConfig);

	let server = restify.createServer({
        name: 'Strajah security layer'
    });

    server.use(restify.queryParser());
    server.use(restify.bodyParser());

	const registerServices = require('./registerServices');
	registerServices(server, customConfig);

    return server;
}

function start (server, port, callback){
    server.listen(port, () => {
        callback();
    });
}

function stop (server, callback){
    server.close(() => {
        callback();
    });
}
