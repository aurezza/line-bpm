'use strict';

var cors = require('cors');
var jwt = require('jsonwebtoken');
var logger = require('../logger');
var Token = require('../node/token-generator');
var Api = require('../service/Api');
var ApiModel = require('../model/ApiModel');

function ApiController() {
    if (!(this instanceof ApiController)) return new ApiController();
    this.model = ApiModel();
}

ApiController.prototype = {
    generateToken,
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

    var checkApiName = this.model.retrieveApiByName(apiName);
    var self = this;
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
                self.model.save(api);
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
            
            self.model.update(api);
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

function corsOptions() {  
    var getCorsOptions = cors(Api().customCorsOptions);
    
    return getCorsOptions;
}

module.exports = ApiController;