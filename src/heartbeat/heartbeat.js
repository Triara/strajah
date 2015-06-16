'use strict';

module.exports = (request, response, next) => {
    response.send(200, 'Ok');
    return next();
};
