var requestModel = require('../models/request-model');

function retrieveRequest(id) {
    var overtimeRequest = requestModel.findOne({process_id: id,
        $or:[{status: "Approved"},{status: "Declined"},{status: "cancelled"}]});
    
    overtimeRequest
    .exec(function(res, err){
        
    });	
		  
    return overtimeRequest;
}

module.exports = retrieveRequest;