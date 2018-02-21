'use strict';

var jwt = require('jsonwebtoken');
var logger = require('../logger');
var retrieveByApiKey = require('./retrieve-by-api-key');
var Token = require('../routes/node/token-generator');

var token = new Token(process.env.APP_SECRET_KEY);

// TODO: create proper UI for generating keys
function generateToken(router) {
    router.get('/api/generate-token/:api_name', function(req, res) {
        // TODO: add authorization handler
        var successVerification = true;
        var dateNow = Date();

        // TODO: create separate? payload for questetra
        const payload = {
            api_name: 'questetra', // change this to either line/quest on request atm
            created_at: dateNow
        }; 

        var key = token.get(); 
        var secretKey = process.env.APP_SECRET_KEY;

        const generatedSecretKey = key + secretKey + dateNow;
    
        logger.info('generatedkey: ', generatedSecretKey);

        var token = jwt.sign(payload, generatedSecretKey);

        // TODO: save generated token and payload details to db

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