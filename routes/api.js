'use strict';

var express = require('express');
var router = express.Router();
var logger = require('../logger');
var kernel = require('../kernel');
var ApiController = require('../controller/ApiController');

// TODO: add separately as functions in app.js
// refer to https://stackoverflow.com/questions/31928417/chaining-multiple-pieces-of-middleware-for-specific-route-in-expressjs
router.use(function(req, res, next) {
    // solution provided in https://github.com/expressjs/cors/issues/71
    // case of non-existing origins that usually come from direct server requests
    logger.info('before set req headers', req.headers);
    req.headers.origin = req.headers.origin || req.headers.host;
    next();
});

router.use(kernel.externalRoutes, ApiController().corsOptions(), function(req, res, next) {
    logger.info('headers: ', JSON.stringify(req.headers));
    // check if sources are valid
    var sourceSignature = req.headers['x-line-signature'] || req.headers['x-origin'];

    if (!sourceSignature) {
        logger.error('No valid source header found');
        return res.send('Invalid source');
    }

    logger.info('source is identified with: ', sourceSignature);
    ApiController().checkSource(sourceSignature, req, res, next);
});

// TODO: additional error handling for other instances
router.use(function tokenSyntaxError(err, req, res, next) {
    if (err instanceof SyntaxError) {
        logger.error("Token Not Readable: ", err.message);
        return res.status(503).send("API Validation Error");
    }
    next(err);
});

router.get('/generate-token/:api_name', ApiController().generateToken);


module.exports = router;