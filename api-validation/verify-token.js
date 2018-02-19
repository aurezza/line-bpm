'use strict';

var jwt = require('jsonwebtoken');
var retrieveByApiKey = require('./retrieve-by-api-key');
var logger = require('../logger');
function verifyToken(verifyToken, req, res, next) {
    if(!verifyToken) return res.status(403).send('Forbidden, no token found');

    var getDecoded = jwt.decode(verifyToken);
    logger.info('decoded values: ', getDecoded);
    
    if(getDecoded == null) return res.status(403).send('Forbidden, incomplete token');

    var payLoadExists = retrieveByApiKey(getDecoded.api_name, getDecoded.created_at, verifyToken);
    payLoadExists.then(function(payLoadExists) {
        if(!payLoadExists) return res.send('Payload details not found in db');
        var apiKey = payLoadExists.api_key;
        var createdAt = payLoadExists.created_at;
        var secretKey = process.env.APP_SECRET_KEY;
        
        const generatedSecretKey = apiKey + secretKey + createdAt;
        jwt.verify(verifyToken, generatedSecretKey, function(err, decoded) {
            if(err) {
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

module.exports = verifyToken;