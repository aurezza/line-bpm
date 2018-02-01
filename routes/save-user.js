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
      .catch(function(err) {
        // add status 500 for error
        logger.info('save error');
        logger.error(err);
        console.log(err);
      });
}

module.exports = saveUser;