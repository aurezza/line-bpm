var localechecker = require('../locale/localechecker');
function scanQrCode(client,line_userId)
{
    var localeText = localechecker('jp','scanQrCode');
    const message = {
        type: 'text',
        text: localeText.text+line_userId,
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