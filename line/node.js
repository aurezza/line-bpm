'use strict';
var querystring = require('querystring');
var logger = require('../logger');
var errorLocator = require('../routes/node/error-locator');
var Questetra = require('./questetra');
var questetra = new Questetra();

function Node() {}

Node.prototype = {
    incomingMessage: incomingMessage,
    outgoingMessage: outgoingMessage
};


function incomingMessage(instanceId, isMessageSent) {

    var axiosParameters = {
        url: process.env.REPLYURL_TO_QUESTETRA_REQUEST_STATUS,
        content: {
            processInstanceId: instanceId,
            key: process.env.KEY_TO_QUESTETRA_REQUEST_STATUS,
            //q_sendingstatus from questetra also be used as query params
            q_sendingstatus: isMessageSent
        }
    };
    questetra.reply(axiosParameters);
}

function outgoingMessage(postBack, client, line_userId) {
    let Line = require('./line');
    let line = new Line();
    let Requests = require('../service/requests');
    let request = new Requests();

    var parsedData = (querystring.parse(postBack.data));
    var axiosParameters = {
        url: process.env.REPLYURL_TO_QUESTETRA,
        content: {
            processInstanceId: parsedData.processInstanceId,
            key: process.env.KEY_TO_QUESTETRA,
            //q_replymessage from questetra also be used as query params
            q_replymessage: parsedData.q_replymessage
        }
    };
    var retrievedRequestData = request.retrieve(parsedData.processInstanceId);

    retrievedRequestData
        .then(function (retrievedRequestData) {
            line.notifyUserResponded(retrievedRequestData, client, line_userId, parsedData);
        })
        .catch(function (error) {
            logger.error(error.message);
            logger.error(errorLocator());
        });   
    questetra.reply(axiosParameters);
}

module.exports = Node;