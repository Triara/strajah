'use strict';

const config = require('../../../../src/config.js').proxy,
    _ = require('lodash');


module.exports = () => {
    this.Given(/^strajah is protecting the following path$/, (protectedPathsTable, done) => {
        const protectedPaths = protectedPathsTable.hashes()[0];

        let customProxyConfig = _.cloneDeep(config);
		var regex = protectedPaths['protected path'];
		if(_.startsWith(regex,'/') &&_.endsWith(regex,'/')){
			regex = new RegExp(regex.substr(1, regex.length-2))
		}
		console.log(regex);
        customProxyConfig.paths[0] = {
            path: regex,
            methods: protectedPaths['allowed methods']
        };
        let customConfig = {
            proxy : customProxyConfig
        };

        this.serverInstance.create(customConfig);
        this.serverInstance.start(done);
    });
};
