'use strict';
var userModel = require('..//models/user-model');
var logger = require('../logger');

var Users = (function () {
    
    function Users(userData) {
        //constructor
        this.employee_id = userData.employee_id;
        this.employee_name = userData.employee_name;
        this.employee_email = userData.employee_email;
        this.line_id = userData.line_id;
        this.locale = userData.locale;
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
                logger.info('data saved', savedObject);
            })
            .catch(function(error) {
                logger.error(error.message);
                logger.error(error.stack); 
            });
    }
    return Users;
}());
module.exports = Users;