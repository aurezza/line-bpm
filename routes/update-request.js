var requestModel = require('../models/request-model');
var logger = require('../logger');

function updateRequest(params) {
    var replymessage = params.q_replymessage
    var requestStatus = {
        yes:"Approve",
        no:"Declined"
    }
    console.log("id",params.processInstanceId);
    requestModel.update({ process_id: params.processInstanceId }, 
        { $set: {status : requestStatus[replymessage]}},
        function(){
            logger.info("updated");
        });
    
}

module.exports = updateRequest;