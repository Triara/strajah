'use strict';

const restify = require('restify');

module.exports = {
    create: create,
    start: start,
    stop: stop
};

function create(){
    let server = restify.createServer({
        name: 'Strajah security layer'
    });

    server.use(restify.queryParser());
    server.use(restify.bodyParser());

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
