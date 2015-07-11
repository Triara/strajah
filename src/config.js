'use strict';

module.exports = {
	publicPort: 3000,
	database: {
		host: process.env['STRAJAH_MONGO_HOST'] || 'localhost',
		port: process.env['STRAJAH_MONGO_PORT'] ||  27017,
		name: process.env['STRAJAH_MONGO_DB_NAME'] || 'strajah',
		collectionName: process.env['STRAJAH_MONGO_DB_COLLECTION'] || 'users'
	},
	tokens: {
		cipherKey: process.env['STRAJAH_CIPHER_KEY'] || 'myCipherKey123',
		firmKey: process.env['STRAJAH_FIRM_KEY'] || 'myFirmKey123'
	},
	proxy: {
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
	}
};
