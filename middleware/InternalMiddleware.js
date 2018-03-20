'use strict';

var logger = require('../logger');

function InternalMiddleware() {
    //constructor
    if (!(this instanceof InternalMiddleware)) return new InternalMiddleware();
}

InternalMiddleware.prototype = {
    setOrigin
};


function setOrigin(req, res, next) {
    // solution provided in https://github.com/expressjs/cors/issues/71
    // case of non-existing origins that usually come from direct server requests
    logger.info('before set req headers', req.headers);
    req.headers.origin = req.headers.origin || req.headers.host;
    next();
}

module.exports = InternalMiddleware;