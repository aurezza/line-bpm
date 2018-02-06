var localeChecker = require('../locale/locale-checker');
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
            console.log("message sent to "+ line_userId);    
        })
        .catch((err) => {
            console.log(err)
        });         
  
}

module.exports = informUserExistence;