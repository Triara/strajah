'use strict';

const _ = require('lodash'),
    retrieveCustomers = require('./../storage/retrieveFromStorage.js');

module.exports = login;

function login(request, response, next) {
    retrieveCustomers().then(customer => {
        if (_.isNull(customer) || customer.name !== request.body.name || customer.password !== request.body.password) {
            response.send(401);
            return next();
        }

        const body = {accessToken: '123abc'};
        response.json(200, body);
        return next();
    });
}
