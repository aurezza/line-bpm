var requestModel = require('../models/request-model');
var logger = require('../logger');

function updateRequest(params) {
    // create instance of model transactionModel

    var newRequest = new requestModel();

    newRequest.user_name = params.user_name;
    newRequest.overtime_date = params.overtime_date;
    newRequest.process_id = params.process_id;
    newRequest.reason = params.reason;
    newRequest.status = params.q_replymessage;
    newRequest.manager_email = params.manager_email;
    
    console.log(newRequest.user_name);
    console.log(newRequest.overtime_date);
    console.log(newRequest.process_id);
    console.log(newRequest.reason);
    console.log(newRequest.status);
    console.log(newRequest.manager_email);

    newRequest.update({ process_id: newRequest.processInstanceId }, 
        { $set: { 
                user_name : newRequest.user_name,
                overtime_date : newRequest.overtime_date,
                reason : newRequest.overtime_reason,
                status : newRequest.q_replymessage ,
                manager_email : newRequest.manager_email,
                }
    });
    logger.info("updated");
}

module.exports = updateRequest;