'use strict';
var cancelledMessageContent = require('../questetra/message-text/cancelled-message-content');
var logger = require('../../logger');
var errorLocator = require('../node/error-locator');
function sendCancelledRequest(managerData, body, client){

    var messageText = cancelledMessageContent(body);
        const message = {
            type: 'text',
            text: messageText.header+messageText.text,
            };
        client.pushMessage(managerData.line_id, message)
            .then(() => {
                logger.info("message sent to "+ managerData.line_id);    
            })
            .catch((error) => {
                logger.error(error.message);
                logger.error(errorLocator());
            });
}

module.exports = sendCancelledRequest;