var localeChecker = require('../locale/locale-checker');
var logger = require('../../logger');
var Token = require('../node/token-generator');
var saveAccessPass = require('../save-access-pass');
var retrieveAccessPassOwner = require('../retrieve-access-pass-line-id');
var updateAccessPassToken = require('../update-access-pass-token');

function scanQrCode(client,line_userId){

    accessPass = new Token(line_userId);
    token = accessPass.get();
    var owner = retrieveAccessPassOwner(line_userId);
    owner
    .then(function(owner){
        if(owner){
            updateAccessPassToken(line_userId,token)
        }else{
            saveAccessPass(token,line_userId);
        }            
        var localeText = localeChecker('jp','scan-qr-code');
        var url = process.env.APP_URL+'verify/'+token+'/';
    
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
                console.log('text');
                // logger.error(err);
            }); 
    })
    .catch(function(){
    });
  
}

module.exports = scanQrCode;