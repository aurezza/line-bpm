'use strict';
var requestModel = require('../models/request-model');
var logger = require('../logger');

function updateRequest(params) {
    console.log('params',params.processInstanceId);
    console.log('params',params.q_replymessage);
    
    var replymessage = params.q_replymessage ;
    var requestStatus = {
        yes:"Approved",
        no:"Declined"
    };
    requestModel
    .findOneAndUpdate({process_id: params.processInstanceId, status: "cancelled"},
    {status : requestStatus[replymessage]},
    function(){
        logger.info('updated')
    }
    );

       


    // requestModel.update({ process_id: params.processInstanceId }, 
    //     { $set: {status : requestStatus[replymessage]}},
    //     function(){
    //         logger.info("process_id :"+params.processInstanceId+" was updated");
    //     });
    
}

module.exports = updateRequest;