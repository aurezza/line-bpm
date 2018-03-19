'use strict';
var apiModel = require('../models/api-model');
var logger = require('../logger');

// setting default variables
function Api(apiData = {}) {
    // declare Api as a method; no need to decare as a new instance of class
    if (!(this instanceof Api)) return new Api();
}

Api.prototype = {
    save: save,
    update: update,
    retrieveApiByKey: retrieveApiByKey,
    retrieveApiByName: retrieveApiByName
};

function save(api) {
    var newApi = new apiModel();
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
    apiModel.updateOne({ api_name: api.api_name }, 
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
    var api = apiModel.findOne({api_key: apiKey});
    
    api.exec(function(err, res) {
        if (err) return logger.error("retrieve API error: ", err);
    });	

    return api;
}

function retrieveApiByName(apiName) {
    var api = apiModel.findOne({api_name: apiName});
    
    api.exec(function(err, res) {
        if (err) return logger.error("retrieve API name error: ", err);
    }); 
    
    return api;
}

module.exports = Api;
