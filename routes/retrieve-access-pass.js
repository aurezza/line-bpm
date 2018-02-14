var accessPassModel = require('../models/access-pass-model');
var logger = require('.././logger');
function retrieveUsers(lineId, token){
        // convert save code above to promise
		var accessPass = accessPassModel.findOne(
			{owner: lineId},
            {access_pass_token: token},
            {status:"active"}
            
		);
		
		accessPass
		.exec(function(res, err){
            // logger.error("retrieveUsers error: ", err);
		});
		
    return accessPass;
}

module.exports = retrieveUsers;