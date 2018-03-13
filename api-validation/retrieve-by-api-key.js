'use strict';

var apiSchema = require('../schema/api-schema');
var logger = require('../logger');

function retrieveApiByKey(apiKey) {
    var api = apiSchema.findOne({api_key: apiKey});
    
    api
        .exec(function(err, res) {
            if (err) return logger.error("retrieve API error: ", err);
        });	

    return api;
}

module.exports = retrieveApiByKey;