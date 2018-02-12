var cancelledMessageContent = require('../questetra/message-text/cancelled-message-content');

function sendCancelledRequest(managerData, body, client){

    var messageText = cancelledMessageContent(body);
    console.log("messageText",messageText)
        const message = {
            type: 'text',
            text: messageText.header+messageText.text,
            };
        client.pushMessage(managerData.line_id, message)
            .then(() => {
                logger.info("message sent to "+ managerData.line_id);    
            })
            .catch((err) => {
                logger.error(err);
            });
}

module.exports = sendCancelledRequest;