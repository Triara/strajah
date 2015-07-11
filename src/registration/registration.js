'use strict';

const retrieveCustomer = require('./../storage/retrieveFromStorage.js'),
    persistOnStorage = require('./../storage/persistOnStorage.js'),
    _ = require('lodash');

module.exports = (request, response, next) => {
    if (_.isEmpty(request.body.name)) {
        response.json(400, 'missing name property');
        return next();
    }

    if (_.isEmpty(request.body.password)) {
        response.json(400, 'missing password property');
        return next();
    }

    retrieveCustomer({name:request.body.name}).then(customer => {
        if (!_.isEmpty(customer)) {
            response.json(400, 'user already exist');
            return next();
        }

        persistOnStorage({name: request.body.name, password: request.body.password}).then(() => {
            response.json(201, 'ok');
            return next();
        });
    });
};
