'use strict';
var apiSchema = require('../schema/api-schema');
var logger = require('../logger');

function ApiModel() {
    if (!(this instanceof ApiModel)) return new ApiModel();
}

ApiModel.prototype = {
    save,
    update,
    retrieveApiByKey,
    retrieveApiByName
};

function save(api) {
    var newApi = new apiSchema();
    logger.info('api: ', api);
    newApi.api_name = api.api_name;
    newApi.api_key = api.api_key;
    newApi.token = api.token;
    newApi.created_at = api.created_at;
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

function update(api) {
    var dateNow = new Date();
    apiSchema.updateOne({ api_name: api.api_name }, 
        { 
            $set: {
                token: api.token, 
                api_key: api.api_key, 
                updated_at: dateNow.toUTCString()
            }
        },
        function() {
            logger.info("API for " + api.api_name + " was updated");
        });
}

function retrieveApiByKey(apiKey) {
    var api = apiSchema.findOne({api_key: apiKey});
    
    api.exec(function(err, res) {
        if (err) return logger.error("retrieve API error: ", err);
    });	

    return api;
}

function retrieveApiByName(apiName) {
    var api = apiSchema.findOne({api_name: apiName});
    
    api.exec(function(err, res) {
        if (err) return logger.error("retrieve API name error: ", err);
    }); 
    
    return api;
}

module.exports = ApiModel;
