'use strict';

const retrieveCustomers = require('./../storage/retrieveFromStorage.js'),
    persistOnStorage = require('./../storage/persistOnStorage.js'),
    _ = require('lodash');

module.exports = (request, response, next) => {
    retrieveCustomers().then(customers => {
        if (_.isEmpty(request.body.name)) {
            response.json(400, 'missing name property');
            return next();
        }

        if (_.isEmpty(request.body.password)) {
            response.json(400, 'missing password property');
            return next();
        }

        let filteredCustomers = _.filter(customers, retrievedCustomer => {
            return retrievedCustomer.name === request.body.name;
        });

        if (!_.isEmpty(filteredCustomers)) {
            response.json(400, 'user already exist');
            return next();
        }

        persistOnStorage({name: request.body.name, password: request.body.password}).then(() => {
            response.json(201, 'ok');
            return next();
        });
    });
};
