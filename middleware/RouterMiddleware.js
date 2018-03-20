'use strict';

var logger = require('../logger');

function RouterMiddleware() {
    //constructor
    if (!(this instanceof RouterMiddleware)) return new RouterMiddleware();

}

RouterMiddleware.prototype = {
    setOrigin,
    tokenSyntaxError,
    test
};


function setOrigin(req, res, next) {
    // solution provided in https://github.com/expressjs/cors/issues/71
    // case of non-existing origins that usually come from direct server requests
    logger.info('before set req headers', req.headers);
    req.headers.origin = req.headers.origin || req.headers.host;
    next();
}

function test(req, res, next) {
    logger.info("--------TEST----------");
    next();
}


// TODO: additional error handling for other instances
function tokenSyntaxError(err, req, res, next) {
    if (err instanceof SyntaxError) {
        logger.error("Token Not Readable: ", err.message);
        return res.status(503).send("API Validation Error");
    }
    next(err);
}

module.exports = RouterMiddleware;