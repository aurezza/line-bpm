var replyToQuestetra = require('./reply-to-questetra');
var axios = require('axios');
var querystring = require('querystring');
var updateRequestStatus = require('./update-request-status');
var retrieveRequest = require('.././retrieve-request');
function toNode(postBack){
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
    var retrievedRequestData = retrieveRequest(parsedData.processInstanceId,parsedData.q_replymessage);

    retrievedRequestData
    .then(function (retrievedRequestData){
        console.log("retrievedRequestData",retrievedRequestData)
    })
    .catch(function (){

    });

    updateRequestStatus(parsedData);
    // console.log(updateRequestStatus(parsedData));
    replyToQuestetra(querystring, axios, postBack, axiosParameters)
}

module.exports = toNode;