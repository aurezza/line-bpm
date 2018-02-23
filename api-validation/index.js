'use strict';

var logger = require('../logger');
var verifyToken = require('./verify-token');
var kernel = require('../kernel');
var corsOptions = require('./cors-options');
var checkSource = require('./check-source');
var cors = require('cors');

function apiValidation(router) {
    router.use(function(req, res, next){
        // solution provided in https://github.com/expressjs/cors/issues/71
        // case of non-existing origins that usually come from direct server requests
        logger.info('before set req headers', req.headers);
        req.headers.origin = req.headers.origin || req.headers.host;
        next();
    });

    // external validation
    router.use(kernel.externalRoutes, cors(corsOptions), function(req, res, next) {
        // check if sources are valid
        var sourceSignature = req.headers['x-line-signature'] // add questetra source here;

        logger.info('source is identified with: ', sourceSignature);
        checkSource(sourceSignature, req, res, next);

        logger.info('passing through api validation...');
        logger.info('headers: ', JSON.stringify(req.headers));

        var getToken = req.params.token || req.query.token || req.body.token || req.header['x-access-token'];

        verifyToken(getToken, req, res, next);
    });

    // TODO: additional error handling for other instances
    router.use(function tokenSyntaxError(err, req, res, next) {
        if (err instanceof SyntaxError) {
          logger.error("Token Not Readable: ", err.message);
          return res.status(503).send("API Validation Error");
        }
        next(err);
    });
}

module.exports = apiValidation;