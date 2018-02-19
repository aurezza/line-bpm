'use strict';

var logger = require('../logger');
var verifyToken = require('./verify-token');

function apiValidation(router) {
    var externalRoutes = ['/receiveFromQuest', '/handler', '/verify/:lineId'];
    router.use(externalRoutes, function(req, res, next) {
        logger.info('passing through api validation...');
        logger.info('headers: ', JSON.stringify(req.headers));
        // enable CORS - Cross-Origin Resource Sharing
        req.header('Access-Control-Allow-Credentials', true);
        req.header("Access-Control-Allow-Origin", "*");
        req.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept", "token");
        req.header("Access-Control-Allow-Methods", 'GET, POST');

        // verify token
        var getToken = req.params.token || req.query.token || req.body.token || req.header['x-access-token'];

        verifyToken(getToken, req, res, next);
    });
}

module.exports = apiValidation;