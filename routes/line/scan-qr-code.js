var localeChecker = require('../locale/locale-checker');
function scanQrCode(client,line_userId)
{
    var localeText = localeChecker('jp','scan-qr-code');
    var url = process.env.APP_URL+'verify/';
    var msgContent = localeText({url:url});
    
    const message = {
        type: 'text',
        text: msgContent.text+line_userId,
        };
    client.pushMessage(line_userId, message)
        .then(() => {
            console.log("message sent to "+ line_userId);    
        })
        .catch((err) => {
            console.log(err)
        });         
  
}

module.exports = scanQrCode;