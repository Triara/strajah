'use strict';

module.exports = {
    publicPort: 3000,
    database: {
        host: 'localhost',
        port: 27017,
        name: 'strajah',
        collectionName: 'customers'
    },
    tokens: {
        cipherKey: process.env['STRAJAH_CIPHER_KEY'] || 'myCipherKey123',
        firmKey: process.env['STRAJAH_FIRM_KEY'] || 'myFirmKey123'
    }
};
