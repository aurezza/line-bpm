var localeChecker = require('./locale/locale-checker');
var logger = require('../logger');
function successVerifyLineMessage(client, lineID)
{
    var localeText = localeChecker('jp','verify-content');

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
        loegger.error(err)
    });             
  
}

module.exports = successVerifyLineMessage;