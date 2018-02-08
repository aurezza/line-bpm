'use strict';
var sendResponded = require('./send-responded');
var updateRequestStatus = require('./update-request-status');
// function informUserRequestResponded(retrievedRequestData,client,line_userId,parsedData){
    function informUserRequestResponded(data){    
        console.log("Object",Object.keys(data).length);
    // console.log("client",client);
    // console.log("line_userId",line_userId);
    // console.log("parsedData",parsedData);
    // if (Object.keys(retrievedRequestData).length) return sendResponded(client,line_userId);
    
    // updateRequestStatus(parsedData);
    
}

module.exports = informUserRequestResponded;