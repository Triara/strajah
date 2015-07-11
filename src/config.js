'use strict';

module.exports = {
	publicPort: 3000,
	database: {
		uri : process.env['STRAJAH_MONGO_URI'] ||'mongodb://localhost:27017/strajah',
		collectionName: process.env['STRAJAH_MONGO_COLLECTION'] || 'users'
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
