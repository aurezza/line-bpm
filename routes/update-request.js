var requestModel = require('../models/request-model');
var logger = require('../logger');

function updateRequest(params) {
    // create instance of model transactionModel
    var updateRequest = requestModel.update({ process_id: params.processInstanceId }, 
        { $set: {reason : params.overtime_reason}});

    updateRequest
    .exec(function(res, err){
        // logger.error("retrieveRequest error: ", err);
    });	    


    logger.info("updated");
}

module.exports = updateRequest;