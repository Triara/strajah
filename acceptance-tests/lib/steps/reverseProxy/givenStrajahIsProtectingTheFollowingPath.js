'use strict';

const config = require('../../../../src/config.js').proxy,
    _ = require('lodash');


module.exports = () => {
    this.Given(/^strajah is protecting the following path$/, (protectedPathsTable, done) => {
        const protectedPaths = protectedPathsTable.hashes()[0];

        let customProxyConfig = _.cloneDeep(config);
        customProxyConfig.paths[0] = {
            path: protectedPaths['protected path'],
            methods: protectedPaths['allowed methods']
        };

        this.serverInstance.registerServices(customProxyConfig);
        this.serverInstance.start(done);
    });
};
