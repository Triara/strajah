var debug = require('debug')('strajah:middleware:checkPublic');

module.exports = function(publicEndpoints) {

    function _checkPublic(req, res, cbk){
        var path = String(req.url);

        for(var i = 0; i < publicEndpoints.length; i++){
            var publicEndpoint =  publicEndpoints[i];
            var exp = publicEndpoint.path;

            //wildcard
            var check = exp.replace(/\*/g,'.*');

            var match = path.match(check);
            var isPublic = (match != null && path == match[0]);
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
