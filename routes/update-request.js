var requestModel = require('../models/request-model');
var logger = require('../logger');

function updateRequest(params) {
    // create instance of model transactionModel
    requestModel.update({ process_id: params.processInstanceId }, 
        { $set: {reason : params.overtime_reason}})
        .then(function(res){
            logger.info("updated");
        })
        .catch(function(err){
            console.log('err',err);
        });
    
}

module.exports = updateRequest;