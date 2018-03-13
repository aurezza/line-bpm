'use strict';
var errorLocator = require('../node/error-locator');
var Message = require('../message');
var logger = require('../logger');
var Token = require('../node/token-generator');
var AccessPassModel = require('../model/access-pass');
var localeChecker = require('../locale/locale-checker');
var RequestModel = require('../model/requests');
let Questetra = require('./questetra');
var textMessage = new Message();
var questetra = new Questetra();
function Line () {}

Line.prototype = {
    checkManagerDetails: checkManagerDetails,
    notifyUserResponded: notifyUserResponded,
    scanQrCode: scanQrCode,
    sender: sender,
    sendCancelledRequest: sendCancelledRequest,
    responded: responded,
    userExist: userExist
};
function checkManagerDetails(managerData, body, client) {
    logger.info('check manager details');

    if (managerData != null) return sender(body, managerData, client);
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

    let requestModel = new RequestModel();   
    if (retrievedRequestData != null) return responded(retrievedRequestData, client, line_userId);
    requestModel.updateToApproveDisapprove(parsedData);
    
}

function scanQrCode(client, line_userId) {
    logger.info('scan qr code');
    var generate = new Token(line_userId);
    var token = generate.get();
    var accessPass = new AccessPassModel();
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
            clientPushMessage(client, line_userId, message, null);
        })
        .catch(function(error) {
            logger.error(error.message);
            logger.error(error.stack);
        });
  
}

function sender(body, managerData, client) {
    logger.info('line request sender is triggered');
    var messageText = textMessage.messageContent(body);
    const message = {
        "type": "template",
        "altText": "this is a confirm template",
        "template": {
            "type": "confirm",
            "text": messageText.text,
            "actions": [
                {
                    "type": "postback",
                    "label": messageText.label.approve,
                    "text": messageText.text +
                               messageText.status.approved,
                    "data": "processInstanceId=" + body.process_id + "&q_replymessage=yes" +
                      "&manager_email=" + body.manager_email + "&user_name=" + body.user_name +
                      "&overtime_date=" + body.overtime_date + "&overtime_reason=" + body.overtime_reason
                },
                {
                    "type": "postback",
                    "label": messageText.label.decline,
                    "text": messageText.text +
                               messageText.status.declined,
                    "data": "processInstanceId=" + body.process_id + "&q_replymessage=no" +
                      "&manager_email=" + body.manager_email + "&user_name=" + body.user_name +
                      "&overtime_date=" + body.overtime_date + "&overtime_reason=" + body.overtime_reason
                }
            ]
        }    
    };
    clientPushMessage(client, managerData.line_id, message, body);          

}

function sendCancelledRequest(managerData, body, client) {
    logger.info('line sender of cancelled request is triggered');
    var messageText = textMessage.cancelledMessageContent(body);
    const message = {
        type: 'text',
        text: messageText.header + messageText.text,
    };
   
    clientPushMessage(client, managerData.line_id, message, false);
}

function userExist(client, line_userId, userName) {
    var localeText = localeChecker('jp', 'scan-qr-code');
    var msgContent = localeText({userName: userName});    
    const message = {
        type: 'text',
        text: msgContent.userExist,
    };
    clientPushMessage(client, line_userId, message, false);        
  
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
    clientPushMessage(client, line_userId, message, false);    
}


function clientPushMessage(client, line_userId, message, body) {
    var requestModel = new RequestModel(); 
    client.pushMessage(line_userId, message)
        .then(() => {
            
            logger.info("message sent to " + line_userId);
            if (!body) return;
            logger.info("serviceRequest.save");
            requestModel.save({
                user_name: body.user_name,
                overtime_date: body.overtime_date,
                process_id: body.process_id,
                reason: body.overtime_reason, 
                status: 'pending',
                manager_email: body.manager_email,       
            })
            questetra.incomingMessage(body.process_id, 'yes');     
        })
        .catch((error) => {
            logger.error(error.message);
            logger.error(errorLocator());
            if (!body) return;
            logger.info("serviceRequest.save");
            requestModel.save({
                user_name: body.user_name,
                overtime_date: body.overtime_date,
                process_id: body.process_id,
                reason: body.overtime_reason, 
                status: 'failed',
                manager_email: body.manager_email,       
            })
            questetra.incomingMessage(body.process_id, 'no'); 
        });
 
}
module.exports = Line;