'use strict';
var replyToQuestetra = require('./reply-to-questetra');
var sender = require('./sender');

function checkManagerDetails(managerData, body, client) {
    if (managerData != null) return sender(body, managerData, client);
    var axiosParameters = {
        url: process.env.REPLYURL_TO_QUESTETRA_REQUEST_STATUS,
        content: {
            processInstanceId: body.process_id,
            key: process.env.KEY_TO_QUESTETRA_REQUEST_STATUS,
            //q_sendingstatus from questetra also be used as query params
            q_sendingstatus: 'no manager detail'
        }
    };

    replyToQuestetra('emptyPostBack', axiosParameters);
    
}
module.exports = checkManagerDetails;