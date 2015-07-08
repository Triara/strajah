'use strict';

const _ = require('lodash'),
    generateToken = require('./generateToken'),
    retrieveCustomers = require('./../storage/retrieveFromStorage.js');

module.exports = login;

function login(request, response, next) {
    retrieveCustomers().then(customer => {
        if (request.header('Authorization').split(' ')[0].toLowerCase() !== 'basic') {
            response.send(400);
            return next();
        }

        const authorizationHash = request.header('Authorization').split(' ')[1];

        const basicAuthorization = (new Buffer(authorizationHash, 'base64').toString('ascii')).split(':');
        const userName = basicAuthorization[0];
        const password = basicAuthorization[1];

        if (_.isNull(customer) || customer.name !== userName || customer.password !== password) {
            response.send(401);
            return next();
        }

        const body = {accessToken: generateToken(userName)};
        response.json(200, body);
        return next();
    });
}
