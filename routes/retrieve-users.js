var userModel = require('../models/user-model');
function retrieveUsers(receivedLineID, receivedEmpEmail){
        // convert save code above to promise
		var users = userModel.findOne({$or: [
			{line_id: receivedLineID},
			{employee_email: receivedEmpEmail}
		]});
		
		users
		.exec(function(res, err){
			// logger.info("test");
            // logger.error("retrieveUsers error: ", err);
		});
		
    return users;
}

module.exports = retrieveUsers;