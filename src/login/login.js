'use strict';

module.exports =  login;

function login (request, response, next){
    let body = {
        accessToken: '123abc'
    };

    response.json(200, body);
    return next();
}
