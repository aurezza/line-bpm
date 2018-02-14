var jwt = require('jsonwebtoken');
var logger = require('../logger');
function apiValidation(router, generatedSecretKey) {// generate key
    
    router.use(function(req, res, next) {
        logger.info('passing through api validation...');
        // enable CORS - Cross-Origin Resource Sharing
        // place limitations for domains here, like https://line or questetra url
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        res.cookie('token', jwt)

        // verify token
        var verifyToken = req.params.token || req.query.token || req.body.token || req.header['x-access-token'];

        if(!verifyToken) return res.status(403).send('Forbidden, no token found');

        // TODO: Add cutom? function here to check if encoded token is in db
        // jwt verification
        // jwt.verify(verifyToken, generatedSecretKey, function(err, decoded) {
        //     if (!err) return req.decoded = decoded;
        //     return res.send('Token failed to authenticate');
        // })     
        next();
    });
}

module.exports = apiValidation;