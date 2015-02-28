'use strict';

const server = require('./server.js'),
    config = require('./config.js'),
    registerServices = require('./registerServices.js');


let serverInstance = server.create();
registerServices(serverInstance);

server.start(serverInstance, config.publicPort, function (){
    console.log('\n Up and running');
});
