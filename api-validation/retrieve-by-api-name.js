'use strict';

var apiModel = require('../models/api-model');
var logger = require('../logger');

function retrieveApiByName(apiName) {
    var api = apiModel.findOne({api_name: apiName});
    
    api
        .exec(function(err, res) {
            if (err) return logger.error("retrieve API name error: ", err);
        }); 
    return api;
}

module.exports = retrieveApiByName;