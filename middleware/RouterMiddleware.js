'use strict';

var cors = require('cors');
var logger = require('../logger');
var Api = require('../service/Api');

var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });


var VerifyPageController = require('../controller/VerifyPageController');

function RouterMiddleware() {
    //constructor
    if (!(this instanceof RouterMiddleware)) return new RouterMiddleware();

}

RouterMiddleware.prototype = {
    setOrigin,
    checkOrigin,
    tokenSyntaxError,
    csrfProtection,
    expressValidator: expressValidator(),
    corsOptions: corsOptions()
};


function setOrigin(req, res, next) {
    // solution provided in https://github.com/expressjs/cors/issues/71
    // case of non-existing origins that usually come from direct server requests
    logger.info('before set req headers', req.headers);
    req.headers.origin = req.headers.origin || req.headers.host;
    next();
}

function checkOrigin(req, res, next) {
    logger.info('headers: ', JSON.stringify(req.headers));
    // check if sources are valid
    var sourceSignature = req.headers['x-line-signature'] || req.headers['x-origin'];

    if (!sourceSignature) {
        logger.error('No valid source header found');
        return res.send('Invalid source');
    }

    logger.info('source is identified with: ', sourceSignature);
    Api().checkSource(sourceSignature, req, res, next);
}

// Validator
function expressValidator() {
    var validator = VerifyPageController.expressValidator();
    return validator;
}

// CORS
function corsOptions() {  
    var getCorsOptions = cors(Api().customCorsOptions);
    
    return getCorsOptions;
}

// TODO: additional error handling for other instances
function tokenSyntaxError(err, req, res, next) {
    if (err instanceof SyntaxError) {
        logger.error("Token Not Readable: ", err.message);
        return res.status(503).send("API Validation Error");
    }
    next(err);
}


module.exports = new RouterMiddleware;