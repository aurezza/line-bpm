'use strict';
var accessPassModel = require('../models/access-pass-model');
var logger = require('../logger');
function retrieveAccessPassOwner(lineId){
        // convert save code above to promise
		var accessPassOwner = accessPassModel.findOne(
			{line_id: lineId,
            status:"active"}
            
		);
		console.log('here');
		
		accessPassOwner
		.exec(function(res, err){
		});
		
    return accessPassOwner;
}

module.exports = retrieveAccessPassOwner;