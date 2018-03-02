'use strict';

var jwt = require('jsonwebtoken');
var retrieveByApiKey = require('./retrieve-by-api-key');
var logger = require('../logger');
function verifyToken(verifyToken, req, res, next) {
    if (!verifyToken) return res.status(403).send('Forbidden, no token found');

    var getDecoded = jwt.decode(verifyToken);
    logger.info('decoded values: ', getDecoded);
    logger.info('token: ', verifyToken);
    
    if (getDecoded == null) return res.status(403).send('Forbidden, incomplete token');

    var payLoadExists = retrieveByApiKey(getDecoded.api_key);
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

module.exports = verifyToken;