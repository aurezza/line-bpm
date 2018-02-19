'use strict';
var translations = require("../locale/locale-checker")
var logger = require('../../logger');
function sendResponded(retrievedRequestData,client,line_userId){
    
    var response = translations('jp','responded-message');
    var messageType = {
        approved:"responded",
        declined:"responded",
        cancelled:"cancelled"
    };
    var messageResponse = response(messageType[retrievedRequestData.status]);



    const message = {
        type: 'text',
        text: messageResponse,
        };
    client.pushMessage(line_userId, message)
        .then(() => {
            logger.info("message sent to "+ line_userId);    
        })
        .catch((err) => {
            logger.error(err);
        });
}
module.exports = sendResponded;