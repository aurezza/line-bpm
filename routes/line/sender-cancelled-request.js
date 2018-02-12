var messageContent = require('../questetra/message-text/message-content');

function sendCancelledRequest(managerData, req.body, client){

    var messageText = messageContent(body);
        const message = {
            type: 'text',
            text: messageText.text,
            };
        client.pushMessage(managerData.line_id, message)
            .then(() => {
                logger.info("message sent to "+ line_userId);    
            })
            .catch((err) => {
                logger.error(err);
            });
}

module.exports = sendCancelledRequest;