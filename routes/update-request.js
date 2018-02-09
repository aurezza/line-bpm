'use strict';
var requestModel = require('../models/request-model');
var logger = require('../logger');

function updateRequest(params) {
    var replymessage = params.q_replymessage ;
    var requestStatus = {
        yes:"Approved",
        no:"Declined"
    };
    requestModel
    .findOneAndUpdate({process_id: params.processInstanceId, status: "pending"},
    {status : requestStatus[replymessage]},
    function(){
        logger.info('updated');
    }
    );
    
}

module.exports = updateRequest;