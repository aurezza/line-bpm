'use strict';
var userModel = require('../models/user-model');
var logger = require('../logger');
var errorLocator = require('./node/error-locator');
function retrieveUserByEmployeeId(receivedEmployeeID) {

    var users = userModel.findOne({employee_id: receivedEmployeeID});
    
    users
        .exec(function(res, err) {
            if (err.message) { logger.error(err.message); logger.error(errorLocator());}
        });	
		  
    return users;
}

module.exports = retrieveUserByEmployeeId;