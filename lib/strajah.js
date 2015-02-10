var _ = require('lodash');

var errors = require('./errors');

var defaultOptions = {
    public : []
};

module.exports = function(options){
    options = _.assign({}, defaultOptions, options);

    return function(req, res, next){

        var checkPublic = require('./checkPublic')(options.public);
        checkPublic(req, res, function(isPublic){
           if(isPublic){
               next(true);
           }  else {
               res.send(403, errors.forbidden);
               next(false);
           }
        });
    }
};