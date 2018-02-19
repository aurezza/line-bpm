'use strict';
var userModel = require('../models/user-model');
var logger = require('.././logger');
function retrieveUsers(receivedLineID, receivedEmployeeEmail){
        // convert save code above to promise
		var users = userModel.findOne({$or: [
			{line_id: receivedLineID},
			{employee_email: receivedEmployeeEmail}
		]});
		
		users
		.exec(function(res, err){
		});
		
    return users;
}

module.exports = retrieveUsers;