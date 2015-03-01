'use strict';

module.exports =  makeHeartbeat;

function makeHeartbeat (request, response, next){
    response.send(200, 'Ok');
    return next();
}
