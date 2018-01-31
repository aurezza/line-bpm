var userModel = require('../models/user-model');
function retrieveUsers(receivedLineID){
        // convert save code above to promise
		var users = userModel.findOne({line_id: receivedLineID});
		
		users
		.exec(function(res, err){
			// logger.info("test");
            // logger.error("retrieveUsers error: ", err);
		});
		
    return users;
}

module.exports = retrieveUsers;