'use strict';

const _ = require('lodash'),
    retrieveCustomers = require('./../storage/retrieveFromStorage.js');

module.exports = login;

function login(request, response, next) {
    retrieveCustomers().then(function (customers) {
        let filteredCustomers = _.filter(customers, function (retrievedCustomer) {
            return retrievedCustomer.name === request.body.name &&
                retrievedCustomer.password === request.body.password;
        });

        if (_.isEmpty(filteredCustomers)) {
            response.json(401);
            return next();
        }

        let body = {accessToken: '123abc'};
        response.json(200, body);
        return next();
    });
}
