var requestModel = require('../models/request-model');
var logger = require('../logger.js');

function saveRequest(params){
    // create instance of model transactionModel
    var newRequest = new requestModel();

    newRequest.user_name = params.user_name;
    newRequest.overtime_date = params.overtime_date;
    newRequest.process_id = params.process_id;
    newRequest.reason = params.reason;

    newRequest.save()
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

module.exports = saveRequest;