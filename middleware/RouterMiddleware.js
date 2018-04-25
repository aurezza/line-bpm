'use strict';

const { check } = require('express-validator/check');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var whitelistForCors = require('../whitelist-for-cors');

const crypto = require('crypto');
const channelSecret  = process.env.LINE_BOT_CHANNEL_SECRET;

var logger = require('../logger');
// var Api = require('../service/Api');
var ApiModel = require('../model/ApiModel');
var Translator = require('../service/Translator');

var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

function RouterMiddleware() {
    if (!(this instanceof RouterMiddleware)) return new RouterMiddleware();

}

RouterMiddleware.prototype = {
    setOrigin,
    checkOrigin,
    tokenSyntaxError,
    csrfProtection,
    expressValidator: expressValidator(),
    corsOptions: corsOptions(),
    corsCustomOptions,
    checkSource,
    verifyToken
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
    checkSource(sourceSignature, req, res, next);
}

function checkSource(sourceSignature, req, res, next) {
    var getToken = req.params.token || req.query.token || req.body.token || req.header['x-access-token'];

    if (sourceSignature == req.headers['x-line-signature']) {
        logger.info('source is from line');
        const lineBody = JSON.stringify(req.body);
        const lineBodySignature = crypto.createHmac('SHA256', channelSecret).update(lineBody).digest('base64');
    
        if (lineBodySignature != sourceSignature) {
            logger.info('sourceSignature: ', sourceSignature);
            logger.error('source from line is not valid');
            return res.send('source from line is not valid');
        }
        logger.info('body signature: ', lineBodySignature, ' is matched to line source signature'); 
        verifyToken(getToken, req, res, next);
        // next(); 
        
    }

    if (sourceSignature == req.headers['x-origin']) {
        logger.info('source is from questetra');
        if (sourceSignature != 'questetra') {
            logger.error('source from questetra is not valid');
            return res.send('source from questetra is not valid');
        }
        logger.info('source signature is valid');
        verifyToken(getToken, req, res, next);
        // next();
        
    }
}

function verifyToken(getToken, req, res, next) {
    logger.info('passing through api validation...');
    if (!getToken) return res.status(403).send('Forbidden, no token found');

    var getDecoded = jwt.decode(getToken);
    logger.info('decoded values: ', getDecoded);
    logger.info('token: ', getToken);
    
    if (getDecoded == null) return res.status(403).send('Forbidden, incomplete token');

    var payLoadExists = ApiModel().retrieveApiByKey(getDecoded.api_key);
    payLoadExists.then(function(data) {
        if (!data) return res.send('Payload details not found in db');

        var payload = {
            api_key: data.api_key
        }; 
        
        const generatedSecretKey = JSON.stringify(payload) + process.env.APP_SECRET_KEY;
        jwt.verify(getToken, generatedSecretKey, function(err, decoded) {
            if (err) {
                logger.error('Failed authentication: ', err)
                return res.send('Token failed to authenticate');
            }
            logger.info('Token has been verified'); // temp
            next();
            return req.decoded = decoded;
        });
    })
        .catch(function(err) {
            logger.error(err);
        });
}

// Validator
function expressValidator() {
    var notEmpty = Translator().get('verify.error.mustNotBeEmpty');
    
    var validateInputData = [
        check('username', notEmpty)
            .isLength({ min: 1})
            .trim()
            .withMessage(notEmpty),

        check('password')
            .isLength({ min: 1})
            .trim().withMessage(notEmpty),
    ];

    return validateInputData;
}

// CORS
function corsOptions() {  
    var getCorsOptions = cors(corsCustomOptions);
    
    return getCorsOptions;
}

function corsCustomOptions() {
    var customCorsOptions = {
        origin: function(origin, callback) {
            logger.info("origin: ", origin);
            var whiteList = whitelistForCors.find(function(listedUrl) {
                return listedUrl.includes(origin);
            });
    
            if (whiteList) {
                logger.info('successfully allowed by CORS');
                return callback(null, true);
            } 
            logger.error('cors error');
            callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: 'GET, POST'
    }

    return customCorsOptions;
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