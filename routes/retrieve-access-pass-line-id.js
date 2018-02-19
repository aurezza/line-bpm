'use strict';
var accessPassModel = require('../models/access-pass-model');
var logger = require('../logger');
function retrieveAccessPassOwner(lineId){
		// convert save code above to promise
		var accessPassOwner = accessPassModel.findOne(
			{line_id: lineId,
            status:"active"}
            
		);		
		accessPassOwner
		.exec(function(res, err){
			if(err){ logger.error(err.message); logger.error(err.stack);}
		});
		
    return accessPassOwner;
}

module.exports = retrieveAccessPassOwner;