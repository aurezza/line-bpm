'use strict';
var translations = require("../locale/locale-checker")
var logger = require('../../logger');
var errorLocator = require('../node/error-locator');
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
        .catch((error) => {
            logger.error(error.message);
            logger.error(errorLocator());
        });
}
module.exports = sendResponded;