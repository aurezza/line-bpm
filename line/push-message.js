'use strict';
var logger = require('../logger');
var errorLocator = require('../routes/node/error-locator');
function ClientPushMessage() {}

ClientPushMessage.prototype = {
    clientPushMessage: clientPushMessage
}

function clientPushMessage(client, line_userId, message) {

    client.pushMessage(line_userId, message)
        .then(() => {
            logger.info("message sent to " + line_userId);    
        })
        .catch((error) => {
            logger.error(error.message);
            logger.error(errorLocator());
        });
 
}

module.exports = ClientPushMessage;