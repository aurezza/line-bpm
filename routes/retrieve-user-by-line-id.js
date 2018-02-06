var userModel = require('../models/user-model');
var logger = require('../logger');
function retrieveUserByLineId(line_id) {

	var users = userModel.findOne({line_id: line_id});
    
    users
    .exec(function(res, err){
        // logger.error("retrieveUsers error: ", err);
    });	
		  
    return users;
}

module.exports = retrieveUserByLineId;