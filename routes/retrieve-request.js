var requestModel = require('../models/request-model');

function retrieveRequest(id,reply) {
    var request_status = {
        yes:"Approved",
        no:"Declined"
    };
	var overtimeRequest = requestModel.findOne({process_id: id,status: request_status[reply]});
    
    overtimeRequest
    .exec(function(res, err){
        // logger.error("retrieveRequest error: ", err);
    });	
		  
    return overtimeRequest;
}

module.exports = retrieveRequest;