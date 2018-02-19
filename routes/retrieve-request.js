'use strict';
var requestModel = require('../models/request-model');
var errorLocator = require('./node/error-locator');

function retrieveRequest(id) {
    var overtimeRequest = requestModel.findOne({process_id: id,
        $or:[{status: "approved"},{status: "declined"},{status: "cancelled"}]});
    
    overtimeRequest
    .exec(function(res, err){
        if(err.message){ logger.error(err.message); logger.error(errorLocator());}      
    });	
		  
    return overtimeRequest;
}

module.exports = retrieveRequest;