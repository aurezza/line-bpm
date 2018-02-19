'use strict';
var userModel = require('../models/user-model');
var logger = require('../logger');
var errorLocator = require('./node/error-locator');

function retrieveUserByLineId(line_userId) {
	var users = userModel.findOne({line_id: line_userId});
    
    users
    .exec(function(res, err){
        if(err.message){ logger.error(err.message); logger.error(errorLocator());}
    });	
		  
    return users;
}

module.exports = retrieveUserByLineId;