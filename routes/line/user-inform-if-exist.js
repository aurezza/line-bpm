'use strict';
var localeChecker = require('../locale/locale-checker');
var logger = require('../../logger');
function informUserExistence(client,line_userId,userName)
{
    var localeText = localeChecker('jp','scan-qr-code');

    var msgContent = localeText({userName:userName});
    
    const message = {
        type: 'text',
        text: msgContent.userExist,
        };
    client.pushMessage(line_userId, message)
        .then(() => {
            logger.info("message sent to "+ line_userId);    
        })
        .catch((error) => {
            logger.error(error.message);
            logger.error(error.stack);
        });         
  
}

module.exports = informUserExistence;