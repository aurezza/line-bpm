var sendResponded = require('./send-responded');
var updateRequestStatus = require('./update-request-status');

function informUserRequestResponded(retrievedRequestData,client,line_userId,parsedData){    
    console.log("retrievedRequestData",retrievedRequestData);
    if(retrievedRequestData != null) return sendResponded(client,line_userId);
    console.log("client",client);
    console.log("line_userId",line_userId);
    console.log("parsedData",parsedData);
    
    updateRequestStatus(parsedData);
    
}

module.exports = informUserRequestResponded;