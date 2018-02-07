var requestModel = require('../models/request-model');

function retrieveRequest(id) {
	var overtimeRequest = requestModel.findOne({process_id: id});
    
    overtimeRequest
    .exec(function(res, err){
        // logger.error("retrieveRequest error: ", err);
    });	
		  
    return overtimeRequest;
}

module.exports = retrieveRequest;