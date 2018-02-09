'use strict';
var requestModel = require('../models/request-model');
var logger = require('../logger');

function updateRequest(params) {
    var replymessage = params.q_replymessage;
    var requestStatus = {
        yes:"Approved",
        no:"Declined"
    };
    requestModel.update({ process_id: params.processInstanceId }, 
        { $set: {status : requestStatus[replymessage]}},
        function(){
            logger.info("process_id :"+params.processInstanceId+" was updated");
        });
    
}

module.exports = updateRequest;