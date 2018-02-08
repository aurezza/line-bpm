var localeChecker = require('./locale/locale-checker');
var logger = require('../logger');

function successVerifyLineMessage(client, lineID)
{
    var localeText = localeChecker('jp','success-message');
    logger.info(lineID + " is the line ID");
    var msgContent = localeText.successTextMessage;

    const message = {
        type: 'text',
        text: msgContent,
    };

    client.pushMessage(lineID, message)
    .then(() => {
        logger.info("message sent to "+ lineID);    
    })
    .catch((err) => {
        logger.error("there was an error sending message to line: ", err)
    });             
  
}

module.exports = successVerifyLineMessage;