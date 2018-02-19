'use strict';
var accessPassModel = require('../models/access-pass-model');
var logger = require('../logger');
var errorLocator = require('./node/error-locator');
function retrieveAccessPassOwner(lineId){
		// convert save code above to promise
		var accessPassOwner = accessPassModel.findOne(
			{line_id: lineId,
            status:"active"}
            
		);		
		accessPassOwner
		.exec(function(res, err){
			if(err.message){ logger.error(err.message); logger.error(errorLocator());}
		});
		
    return accessPassOwner;
}

module.exports = retrieveAccessPassOwner;