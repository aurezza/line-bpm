var requestModel = require('../models/request-model');

function retrieveRequest(id,reply) {
    var request_status = {
        yes:"Approved",
        no:"Declined"
    };
    console.log("id",id);
    console.log("request_status[reply]",request_status[reply]);
	var overtimeRequest = requestModel.findOne({process_id: id,status: request_status[reply]});
    
    overtimeRequest
    .exec(function(res, err){
        // logger.error("retrieveRequest error: ", err);
    });	
		  
    return overtimeRequest;
}

module.exports = retrieveRequest;