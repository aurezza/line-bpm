var userModel = require('../models/user-model');
var logger = require('../logger');

function retrieveUserByLineId(line_userId) {
	var users = userModel.findOne({line_id: line_userId});
    
    users
    .exec(function(res, err){
        // logger.error("retrieveUsers error: ", err);
    });	
		  
    return users;
}

module.exports = retrieveUserByLineId;