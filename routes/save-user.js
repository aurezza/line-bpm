'use strict';
var userModel = require('../models/user-model');
function saveUser(object, logger){
    // create instance of model transactionModel
    var newUser = new userModel();

    newUser.line_id = object.lineID;
    newUser.employee_id = object.employee_id;
    newUser.employee_name = object.name;
    newUser.employee_email = object.email;
    newUser.locale = object.locale;

    newUser.save()
      .then(function(savedObject) {
        logger.info('data saved');
      })
      .catch(function(error) {
        logger.error(error.message);
        logger.error(error.stack); 
      });
}

module.exports = saveUser;