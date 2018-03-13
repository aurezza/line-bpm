'use strict';
var logger = require('../logger');
var errorLocator = require('../routes/node/error-locator');
var RequestModel = require('../model/requests');
var Node = require('./node');
function ClientPushMessage() {}

ClientPushMessage.prototype = {
    clientPushMessage: clientPushMessage
}

function clientPushMessage(client, line_userId, message, body) {
    let node = new Node();
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
            node.incomingMessage(body.process_id, 'yes');     
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
            node.incomingMessage(body.process_id, 'no'); 
        });
 
}

module.exports = ClientPushMessage;