var requestModel = require('../models/request-model');
var logger = require('../logger');

function updateRequest(params) {

    console.log("id",params.processInstanceId);
    requestModel.update({ process_id: params.processInstanceId }, 
        { $set: {reason : params.overtime_reason}},
        function(){
            logger.info("updated");
        });
    
}

module.exports = updateRequest;