'use strict';

var apiSchema = require('../schema/api-schema');
var logger = require('../logger');

function retrieveApiByName(apiName) {
    var api = apiSchema.findOne({api_name: apiName});
    
    api
        .exec(function(err, res) {
            if (err) return logger.error("retrieve API name error: ", err);
        }); 
    return api;
}

module.exports = retrieveApiByName;