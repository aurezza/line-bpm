'use strict';
var localeChecker = require('../routes/locale/locale-checker');
var ClientPushMessage = require('./push-message');

function Sender() {}

Sender.prototype = {
    userExist: userExist,
    responded: responded
};

function userExist(client, line_userId, userName) {
    var localeText = localeChecker('jp', 'scan-qr-code');
    var msgContent = localeText({userName: userName});    
    const message = {
        type: 'text',
        text: msgContent.userExist,
    };
    var pushMessage = new ClientPushMessage();
    pushMessage.clientPushMessage(client, line_userId, message);        
  
}

function responded(retrievedRequestData, client, line_userId) {
    
    var response = localeChecker('jp', 'responded-message');
    var messageType = {
        approved: "responded",
        declined: "responded",
        cancelled: "cancelled"
    };
    var messageResponse = response(messageType[retrievedRequestData.status]);


    const message = {
        type: 'text',
        text: messageResponse,
    };
    var pushMessage = new ClientPushMessage();
    pushMessage.clientPushMessage(client, line_userId, message);    
}

module.exports = Sender;