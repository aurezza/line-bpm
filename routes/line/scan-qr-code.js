var localeChecker = require('../locale/locale-checker');
var logger = require('../../logger');
var Token = require('../node/token-generator');
function scanQrCode(client,line_userId){

    token = new Token("aaa");
    console.log(token.get());

    var localeText = localeChecker('jp','scan-qr-code');
    var url = process.env.APP_URL+'verify/';
    var msgContent = localeText({url:url});
    
    const message = {
        type: 'text',
        text: msgContent.text+line_userId,
        };
    client.pushMessage(line_userId, message)
        .then(() => {
            logger.info("message sent to "+ line_userId);    
        })
        .catch((err) => {
            logger.error(err);
        });         
  
}

module.exports = scanQrCode;