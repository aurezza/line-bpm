var replyToQuestetra = require('./reply-to-questetra');
function fromReceiver(querystring, axios, instanceId, isMessageSent){

    var axiosParameters = {
        url: process.env.REPLYURL_TO_QUESTETRA_REQUEST_STATUS,
        content:{
            processInstanceId:instanceId,
            key:process.env.KEY_TO_QUESTETRA_REQUEST_STATUS,
            //q_sendingstatus from questetra also be used as query params
            q_sendingstatus:isMessageSent
        }
    };

    replyToQuestetra(querystring, axios, 'emptyPostBack', axiosParameters);

}
module.exports = fromReceiver;