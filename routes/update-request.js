var requestModel = require('../models/request-model');
var logger = require('../logger');

function updateRequest(params) {
    request.update({ process_id: params.processInstanceId }, 
        { $set: { 
                user_name : params.user_name,
                overtime_date : params.overtime_date,
                reason : params.overtime_reason,
                status : params.q_replymessage ,
                manager_email : params.manager_email,
                }
    });
    logger.info("updated");
}

module.exports = updateRequest;