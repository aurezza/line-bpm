'use strict';
var userModel = require('../models/user-model');
var logger = require('../logger');
var errorLocator = require('./node/error-locator');

var Users = (function () {
    
    function Users(userData) {
        //constructor
        this.employee_id = userData.employee_id || null;
        this.employee_name = userData.employee_name || null;
        this.employee_email = userData.employee_email || null;
        this.line_id = userData.line_id || null;
        this.locale = userData.locale || null;
    }

    Users.prototype.save = function (userData) {

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

    Users.prototype.retrieveByLineId = function (lineID) {
        var users = userModel.findOne({line_id: lineID});
        users
            .exec(function(res, err) {
                if (err.message) { logger.error(err.message); logger.error(errorLocator());}
            });	

        return users;
    }


    return Users;
}());
module.exports = Users;