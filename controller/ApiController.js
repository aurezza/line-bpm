'use strict';

var cors = require('cors');
var jwt = require('jsonwebtoken');
var logger = require('../logger');
var Token = require('../node/token-generator');
var Api = require('../service/Api');
var ApiModel = require('../model/ApiModel');
const crypto = require('crypto');
const channelSecret  = process.env.LINE_BOT_CHANNEL_SECRET;

function ApiController() {
    if (!(this instanceof ApiController)) return new ApiController();
}

ApiController.prototype = {
    generateToken,
    verifyToken,
    checkSource,
    corsOptions
};

function generateToken (req, res) {
    // TODO: add authorization handler
    var successVerification = true; 
        
    var apiName = req.params.api_name; 

    if ((apiName !== "line") && (apiName !== "questetra")) {
        logger.warn("Params should only be line/questetra");
        return res.send("Invalid params"); 
    }

    var secretKey = process.env.APP_SECRET_KEY;
    var forHashing = apiName + secretKey;
    var hashedKey = new Token(forHashing);
    var key = hashedKey.get(); 

    var payload = {
        api_key: key
    };
    var dateNow = new Date();

    var generatedSecretKey = JSON.stringify(payload) + secretKey;

    logger.info('generatedkey: ', generatedSecretKey);
    var token = jwt.sign(payload, generatedSecretKey);

    var checkApiName = ApiModel().retrieveApiByName(apiName);
    checkApiName
        .then(function(data) {
            logger.info("checking api name");
            if (!data) {
                var api = {
                    api_name: apiName,
                    api_key: payload.api_key,
                    created_at: dateNow.toUTCString(),
                    token: token
                };
                ApiModel().save(api);
                return res.json({
                    success: true,
                    message: 'You haz token now',
                    token: token
                });
            } 

            logger.info("The api " + data.api_name + " already exists, updating now...");
            var api = {
                api_name: apiName,
                api_key: payload.api_key,
                token: token
            };
            ApiModel().update(api);
            return res.json({
                success: true,
                message: 'Your token has been updated',
                token: token
            });                   
        })
        .catch(function(err) {
            logger.error('Update api error ', err);
        });
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

function verifyToken(verifyToken, req, res, next) {
    logger.info('passing through api validation...');
    if (!verifyToken) return res.status(403).send('Forbidden, no token found');

    var getDecoded = jwt.decode(verifyToken);
    logger.info('decoded values: ', getDecoded);
    logger.info('token: ', verifyToken);
    
    if (getDecoded == null) return res.status(403).send('Forbidden, incomplete token');

    var payLoadExists = ApiModel().retrieveApiByKey(getDecoded.api_key);
    payLoadExists.then(function(data) {
        if (!data) return res.send('Payload details not found in db');

        var payload = {
            api_key: data.api_key
        }; 
        
        const generatedSecretKey = JSON.stringify(payload) + process.env.APP_SECRET_KEY;
        jwt.verify(verifyToken, generatedSecretKey, function(err, decoded) {
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

function corsOptions() {  
    var customCorsOptions = cors(Api().corsOptions());

    return customCorsOptions;
}

module.exports = ApiController;