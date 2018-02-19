'use strict';
var replyToQuestetra = require('./reply-to-questetra');
var axios = require('axios');
var querystring = require('querystring');
var informUserRequestResponded = require('./inform-user-request-responded');
var retrieveRequest = require('.././retrieve-request');
var updateRequestStatus = require('./update-request-status');

function toNode(postBack,client,line_userId){
    var parsedData = (querystring.parse(postBack.data));
    var axiosParameters = {
        url: process.env.REPLYURL_TO_QUESTETRA,
        content : {
            processInstanceId:parsedData.processInstanceId,
            key:process.env.KEY_TO_QUESTETRA,
            //q_replymessage from questetra also be used as query params
            q_replymessage:parsedData.q_replymessage
        }
    };
    var retrievedRequestData = retrieveRequest(parsedData.processInstanceId);

    retrievedRequestData
    .then(function (retrievedRequestData){
       informUserRequestResponded(retrievedRequestData,client,line_userId,parsedData);
    })
    .catch(function (error){
        logger.error(error.message);
        logger.error(error.stack);
    });   
    replyToQuestetra(querystring, axios, postBack, axiosParameters)
}

module.exports = toNode;