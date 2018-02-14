var userModel = require('../models/api-model');
var logger = require('../logger');

function retrieveApiByKey(key) {
	var api = apiModel.findOne({key: key});
    
    api
    .exec(function(res, err){
        logger.info("retrieved data: ", api);
        // logger.error("retrieveUsers error: ", err);
    });	
		  
    return api;
}

module.exports = retrieveApiByKey;