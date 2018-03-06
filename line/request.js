'use strict';
var logger = require('../logger');
var messageContent = require('../routes/questetra/message-text/message-content');
var cancelledMessageContent = require('../routes/questetra/message-text/cancelled-message-content');
var errorLocator = require('../routes/node/error-locator');
var Requests = require('../service/requests');
var Node = require('./node');
var ClientPushMessage = require('./push-message');

function Request () {}

Request.prototype = {
    sender: sender,
    sendCancelledRequest: sendCancelledRequest
};

function sender(body, managerData, client) {
    let node = new Node();
    var request = new Requests(); 
    var messageText = messageContent(body);
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
    client.pushMessage(managerData.line_id, message)
        .then(() => { 
            request.save({
                user_name: body.user_name,
                overtime_date: body.overtime_date,
                process_id: body.process_id,
                reason: body.overtime_reason, 
                status: 'pending',
                manager_email: body.manager_email,       
            })
            node.incomingMessage(body.process_id, 'yes'); 
        })
        .catch((error) => {
            logger.error(error.message);
            logger.error(errorLocator());
            request.save({
                user_name: body.user_name,
                overtime_date: body.overtime_date,
                process_id: body.process_id,
                reason: body.overtime_reason, 
                status: 'failed',
                manager_email: body.manager_email,       
            })
            node.incomingMessage(body.process_id, 'no');         
        });            

}

function sendCancelledRequest(managerData, body, client) {

    var messageText = cancelledMessageContent(body);
    const message = {
        type: 'text',
        text: messageText.header + messageText.text,
    };
    var pushMessage = new ClientPushMessage();
    pushMessage.clientPushMessage(client, managerData.line_id, message);
}

module.exports = Request;