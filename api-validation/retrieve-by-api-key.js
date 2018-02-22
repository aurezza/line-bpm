'use strict';

var apiModel = require('../models/api-model');
var logger = require('../logger');

function retrieveApiByKey(apiKey) {
	var api = apiModel.findOne({api_key: apiKey});
    
    api
    .exec(function(err, res){
        logger.info('retrieve by key ', res);
        if(err) return logger.error("retrieve API error: ", err);
    });	
		  
    return api;
}

module.exports = retrieveApiByKey;