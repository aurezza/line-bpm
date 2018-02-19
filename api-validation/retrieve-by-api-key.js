'use strict';

var apiModel = require('../models/api-model');
var logger = require('../logger');

function retrieveApiByKey(apiName, createdAt) {
    // api_name and created_at
	var api = apiModel.findOne({api_name: apiName, created_at: createdAt});
    
    api
    .exec(function(err, res){
        if(err) return logger.error("retrieve API error: ", err);
    });	
		  
    return api;
}

module.exports = retrieveApiByKey;