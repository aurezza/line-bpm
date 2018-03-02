'use strict';
var userModel = require('../models/user-model');
var logger = require('.././logger');
var errorLocator = require('./node/error-locator');
function retrieveUsers(receivedLineID, receivedEmployeeEmail) {
    // convert save code above to promise
    var users = userModel.findOne({$or: [
        {line_id: receivedLineID},
        {employee_email: receivedEmployeeEmail}
    ]});
		
    users
        .exec(function(res, err) {
            if (err.message) { logger.error(err.message); logger.error(errorLocator());}
        });		
    return users;
}
module.exports = retrieveUsers;