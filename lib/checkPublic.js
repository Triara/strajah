'use strict';

let debug = require('debug')('strajah:middleware:checkPublic');

module.exports = function(publicEndpoints) {

    function _checkPublic(req, res, cbk){
        let path = String(req.url);

        for(let i = 0; i < publicEndpoints.length; i++){
            const publicEndpoint =  publicEndpoints[i];
            let exp = publicEndpoint.path;

            //wildcard
            let check = exp.replace(/\*/g,'.*');

            let match = path.match(check);
            let isPublic = (match != null && path == match[0]);
            debug('match \''+ path +'\' with \'' + exp + '\' : ' + isPublic);
            if(isPublic) {
                debug('public path \''+path+'\'');
                return cbk(true);
            }
        }
        debug('private path \''+path+'\'');

        cbk(false);
    }

    return _checkPublic
};
