var requestModel = require('../models/request-model');

function retrieveRequest(id) {
    var overtimeRequest = requestModel.findOne({process_id: id,
        $or:[{status: "approved"},{status: "declined"},{status: "cancelled"}]});
    
    overtimeRequest
    .exec(function(res, err){
        
    });	
		  
    return overtimeRequest;
}

module.exports = retrieveRequest;