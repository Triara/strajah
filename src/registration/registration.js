'use strict';

const retrieveCustomers = require('./../storage/retrieveFromStorage.js'),
    persistOnStorage = require('./../storage/persistOnStorage.js'),
    _ = require('lodash');

module.exports = function (request, response, next) {
    retrieveCustomers().then(function (customers) {
        if (_.isEmpty(request.body.name)) {
            response.json(400, 'missing name property');
            return next();
        }

        let filteredCustomers = _.filter(customers, function (retrievedCustomer) {
            return retrievedCustomer.name === request.body.name;
        });

        if (!_.isEmpty(filteredCustomers)) {
            response.json(401);
            return next();
        }

        persistOnStorage({name: request.body.name, password: request.body.password});

        response.json(201, 'ok');
        next();
    });
};
