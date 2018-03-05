'use strict';
var userModel = require('../models/user-model');
var logger = require('../logger');
var errorLocator = require('../routes/node/error-locator');

function Users(userData  = {}) {
    //constructor
    this.employee_id = userData.employee_id || null;
    this.employee_name = userData.employee_name || null;
    this.employee_email = userData.employee_email || null;
    this.line_id = userData.line_id || null;
    this.locale = userData.locale || null;
}

Users.prototype = {
    save: save,
    retrieveByLineId: retrieveByLineId,
    retrieveByEmpId: retrieveByEmpId,
    retriveByEmpEmail: retriveByEmpEmail
};
    
function save(userData) {

    var newUser = new userModel();
    newUser.line_id = userData.lineID;
    newUser.employee_id = userData.employee_id;
    newUser.employee_name = userData.name;
    newUser.employee_email = userData.email;
    newUser.locale = userData.locale;
        
    newUser.save()
        .then(function(savedObject) {
            logger.info('data saved');
        })
        .catch(function(error) {
            logger.error(error.message);
            logger.error(error.stack); 
        }); 
}

function retrieveByLineId(lineID) {

    var users = userModel.findOne({line_id: lineID});
    users
        .exec(function(res, err) {
            if (err.message) { logger.error(err.message); logger.error(errorLocator());}
        });	
    return users; 
}

function retrieveByEmpId(receivedEmployeeID) {
    var users = userModel.findOne({employee_id: receivedEmployeeID});
    
    users
        .exec(function(res, err) {
            if (err.message) { logger.error(err.message); logger.error(errorLocator());}
        });	

    return users;
}

function retriveByEmpEmail (receivedEmployeeEmail) {
    var users = userModel.findOne({employee_email: receivedEmployeeEmail});

    users
        .exec(function(res, err) {
            if (err.message) { logger.error(err.message); logger.error(errorLocator());}
        });	

    return users;
}

module.exports = Users;