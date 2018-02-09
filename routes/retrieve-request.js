var requestModel = require('../models/request-model');

function retrieveRequest(id) {
    var overtimeRequest = requestModel.findOne({process_id: "510",
        $or:[{status: "Approved"},{status: "Declined"}]});
    
    overtimeRequest
    .exec(function(res, err){
        console.log("overtimeRequest",overtimeRequest)
    });	
		  
    return overtimeRequest;
}

module.exports = retrieveRequest;