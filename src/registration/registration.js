'use strict';

module.exports = function (request, response, next) {
    response.json(201, 'ok');
    next();
};
