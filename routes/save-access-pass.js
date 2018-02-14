var accessPassModel = require('../models/access-pass-model');
var logger = require('../logger.js');
function saveAccessPass(token,lineId){
    // create instance of model transactionModel
    var newAccessPass = new accessPassModel();

    newAccessPass.access_pass_token = token;
    newAccessPass.owner = lineId;
    newAccessPass.status = "active";

    newRequest.save()
      .then(function(savedObject) {
        logger.info('data saved');
      })
      .catch(function(err) {
        // add status 500 for error
        logger.info('save error');
      });    
}
module.exports = saveAccessPass;