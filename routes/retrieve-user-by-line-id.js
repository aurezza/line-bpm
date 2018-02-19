'use strict';
var userModel = require('../models/user-model');
var logger = require('../logger');

function retrieveUserByLineId(line_userId) {
	var users = userModel.findOne({line_id: line_userId});
    
    users
    .exec(function(res, err){
        if(err){ logger.error(err.message); logger.error(err.stack);}
    });	
		  
    return users;
}

module.exports = retrieveUserByLineId;