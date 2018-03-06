'use strict';
var logger = require('../logger');
var Token = require('../routes/node/token-generator');
var AccessPass = require('../service/access-pass');
var localeChecker = require('../routes/locale/locale-checker');
var Requests = require('../service/requests');
var Sender = require('./sender');
let Questetra = require('./questetra');
let Request = require('./request');
var ClientPushMessage = require('./push-message');

function Line () {}

Line.prototype = {
    checkManagerDetails: checkManagerDetails,
    notifyUserResponded: notifyUserResponded,
    scanQrCode: scanQrCode
};
function checkManagerDetails(managerData, body, client) {
 
    let request = new Request();
    let questetra = new Questetra();

    if (managerData != null) return request.sender(body, managerData, client);
    var axiosParameters = {
        url: process.env.REPLYURL_TO_QUESTETRA_REQUEST_STATUS,
        content: {
            processInstanceId: body.process_id,
            key: process.env.KEY_TO_QUESTETRA_REQUEST_STATUS,
            //q_sendingstatus from questetra also be used as query params
            q_sendingstatus: 'no manager detail'
        }
    };

    questetra.reply(axiosParameters);
    
}

function notifyUserResponded(retrievedRequestData, client, line_userId, parsedData) { 

    let sender = new Sender();
    let requests = new Requests();   
    if (retrievedRequestData != null) return sender.responded(retrievedRequestData, client, line_userId);
    requests.updateToApproveDisapprove(parsedData);
    
}

function scanQrCode(client, line_userId) {
    var generate = new Token(line_userId);
    var token = generate.get();
    var accessPass = new AccessPass();
    var owner = accessPass.retrieveLineId(line_userId);
    owner
        .then(function(owner) {
            if (owner) {
                accessPass.changeAccessPass(line_userId, token)
            } else {
                accessPass.save(token, line_userId)
            }            
            var localeText = localeChecker('jp', 'scan-qr-code');
            var url = process.env.APP_URL + 'verify/' + token + '/';
    
            var msgContent = localeText({url: url});
        
            const message = {
                type: 'text',
                text: msgContent.text + line_userId,
            };
            var pushMessage = new ClientPushMessage();
            pushMessage.clientPushMessage(client, line_userId, message);
        })
        .catch(function(error) {
            logger.error(error.message);
            logger.error(error.stack);
        });
  
}

module.exports = Line;