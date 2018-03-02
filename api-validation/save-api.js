'use strict';
var apiModel = require('../models/api-model');
var logger = require('../logger');
function saveApi(object) {
    // create instance of model transactionModel
    var newApi = new apiModel();
    logger.info('api: ', object);
    newApi.api_name = object.api_name;
    newApi.api_key = object.api_key;
    newApi.token = object.token;
    newApi.created_at = object.created_at;
    newApi.updated_at = Date();

    newApi.save()
        .then(function(savedObject) {
            logger.info('api data saved');
        })
        .catch(function(error) {
            logger.error(error.message);
            logger.error(error.stack); 
        });
}

module.exports = saveApi;