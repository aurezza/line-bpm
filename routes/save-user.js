var userModel = require('../models/user-model');
function saveUser(object, logger){
    // create instance of model transactionModel
    var newUser = new userModel();
    newUser.lineID = object.lineID;
    newUser.employeeID = object.employee_id;
    newUser.employeeName = object.name;
    newUser.employeeEmail = object.email;
    newUser.locale = object.locale;

    newUser.save()
      .then(function(savedObject) {
        logger.info('data saved');
      })
      .catch(function(err) {
        // add status 500 for error
        logger.info('save error');
        logger.error(err);
      });
}

module.exports = saveUser;