var jwt = require('jsonwebtoken');
var retrieveByApiKey = require('./retrieve-by-api-key');
var logger = require('../logger');
function verifyToken(verifyToken, generatedSecretKey, req, res, next) {
    if(!verifyToken) return res.status(403).send('Forbidden, no token found');

    var getDecoded = jwt.decode(verifyToken);
    logger.info('decoded values: ', getDecoded);
    if(getDecoded == null) return res.status(403).send('Forbidden, incomplete token');
    logger.info('the api_name is: ', getDecoded.api_name);

    var payLoadExists = retrieveByApiKey(getDecoded.api_name, getDecoded.created_at);
    payLoadExists.then(function(payLoadExists) {
        if(!payLoadExists) return res.send('Payload details not found in db');
        jwt.verify(verifyToken, generatedSecretKey, function(err, decoded) {
            if(err) return res.send('Token failed to authenticate');
            logger.info('Token has verified'); // temp
            next();
            return req.decoded = decoded;
        });
    })
    .catch(function(err) {
        logger.error(err);
    });
}

module.exports = verifyToken;