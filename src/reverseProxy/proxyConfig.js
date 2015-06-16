'use strict';

module.exports = {
    paths: [
        {
            path: '/firstPath',
            methods: ['GET', 'POST']
        }
    ],
    protectedServer: {
        'host': 'http://localhost',
        'port': 8088
    }
};
