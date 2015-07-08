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
        cipherKey: process.env['STRAJAH_CIPHER_KEY'] || 'cipherkey-change!!',
        firmKey: process.env['STRAJAH_FIRM_KEY'] || 'firmkey-change!!'
    }
};
