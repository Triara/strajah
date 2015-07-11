'use strict';

const request = require('request'),
	decodeToken = require('./decodeToken'),
	_ = require('lodash');

let proxyConfig;
module.exports = function(customConfig){
	proxyConfig = customConfig.proxy;
	return proxy;
};

function proxy(incomingRequest, response, next) {
	const authorizationHeader = incomingRequest.header('Authorization');

	if (_.isUndefined(authorizationHeader) || _.isUndefined(authorizationHeader.split(' ')[1]) || authorizationHeader.split(' ')[0].toLowerCase() !== 'bearer') {
		response.json(401, 'invalid authorization header');
		return next();
	}

	const authorizationTokenSet = decodeToken(authorizationHeader.split(' ')[1]);
	if (!_.isUndefined(authorizationTokenSet.error)) {
		response.json(401, 'invalid authorization token');
		return next();
	}

	const foundCoincidences = _.filter(proxyConfig.paths, protectedUri => {
		return incomingRequest.url.match(protectedUri.path);
	});
	if (foundCoincidences.length === 0) {
		response.send(403);
		return next();
	}

	request({
		url: proxyConfig.protectedServer.host + ':' + proxyConfig.protectedServer.port + incomingRequest.url,
		body: incomingRequest.body,
		json: true,
		method: incomingRequest.method,
		headers: {
			'Authorization': 'User ' + authorizationTokenSet.userId
		}
	}, function (error, receivedResponse, body) {
		response.send(receivedResponse.statusCode, body);
		return next();
	});
}
