'use strict';
var localeChecker = require('../locale/locale-checker');
var logger = require('../../logger');

function successVerifyLineMessage(client, lineID)
{
    var localeText = localeChecker('jp','success-message');
    logger.info(lineID + " has been successfully verified");
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
        logger.error('verify/index.js');
        logger.error(err); 
    });             
  
}

module.exports = successVerifyLineMessage;