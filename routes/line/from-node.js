'use strict';
var replyToQuestetra = require('./reply-to-questetra');
function fromNode(instanceId, isMessageSent) {

    var axiosParameters = {
        url: process.env.REPLYURL_TO_QUESTETRA_REQUEST_STATUS,
        content: {
            processInstanceId: instanceId,
            key: process.env.KEY_TO_QUESTETRA_REQUEST_STATUS,
            //q_sendingstatus from questetra also be used as query params
            q_sendingstatus: isMessageSent
        }
    };

    replyToQuestetra('emptyPostBack', axiosParameters);

}
module.exports = fromNode;