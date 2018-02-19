'use strict';
var accessPassModel = require('../models/access-pass-model');
var logger = require('../logger');
function retrieveAccessPassOwner(lineId){
		// convert save code above to promise
		console.log('here1');
		var accessPassOwner = accessPassModel.findOne(
			{line_id: lineId,
            status:"active"}
            
		);
		console.log('here2');
		
		accessPassOwner
		.exec(function(res, err){
		});
		
    return accessPassOwner;
}

module.exports = retrieveAccessPassOwner;