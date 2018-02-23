'use strict';

var jwt = require('jsonwebtoken');
var logger = require('../logger');
var retrieveByApiName = require('./retrieve-by-api-name');
var saveApi = require('./save-api');
var updateApi = require('./update-api');
var Token = require('../routes/node/token-generator');

// TODO: create proper UI for generating keys
function generateToken(router) {
    router.get('/api/generate-token/:api_name', function(req, res) {
        var successVerification = true; // TODO: add authorization handler
        var apiName = req.params.api_name; 
        if((apiName !== "line") && (apiName !== "questetra")) {
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

        var checkApiName = retrieveByApiName(apiName);
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
                    saveApi(api);
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
                updateApi(api);
                return res.json({
                    success: true,
                    message: 'Your token has been updated',
                    token: token
                });                   
            })
            .catch(function(err){
                logger.error('Update api error ', err);
        });

    });
}

module.exports = generateToken;