'use strict';
var accessPassModel = require('../models/access-pass-model');
var logger = require('../logger');
function retrieveAccessPass(lineId, token){
        // convert save code above to promise
		var accessPass = accessPassModel.findOne(
			{line_id: lineId, access_pass_token: token, status:"active"}
            
		);
		
		accessPass
		.exec(function(res, err){
			if(err){ logger.error(err.message); logger.error(err.stack);}
		});
		
    return accessPass;
}

module.exports = retrieveAccessPass;