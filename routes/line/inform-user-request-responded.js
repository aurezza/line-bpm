'use strict';
var sendResponded = require('./send-responded');
var updateRequestStatus = require('./update-request-status');

function informUserRequestResponded(retrievedRequestData,client,line_userId,parsedData){    
    if(retrievedRequestData != null) return sendResponded(retrievedRequestData,client,line_userId);
    updateRequestStatus(parsedData);
    
}

module.exports = informUserRequestResponded;