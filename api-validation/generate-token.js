var jwt = require('jsonwebtoken');
var logger = require('../logger');
var retrieveByApiKey = require('./retrieve-by-api-key');

// TODO: create proper UI for generating keys
function generateToken(router) {
    router.get('/api/generate-token', function(req, res) {
        // TODO: add authorization handler
        var successVerification = true;

        // TODO: create separate? payload for questetra
        const payload = {
            api_name: 'questetra', // change this to either line/quest on request atm
            created_at: 1518657215797
            // insert other defined values here
        }; 

        var key = 'somethingjibberish';
        var secretKey = process.env.APP_SECRET_KEY;
        var createdAt = 1518657215797; // refer to api db for this value

        const generatedSecretKey = key + secretKey + createdAt;
    
        logger.info('generatedkey: ', generatedSecretKey);

        var token = jwt.sign(payload, generatedSecretKey);

        // return the token information 
        if(successVerification){
            res.json({
                success: true,
                message: 'You haz token now',
                token: token
            });
        }
    });
}

module.exports = generateToken;