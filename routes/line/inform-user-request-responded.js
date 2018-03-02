'use strict';
var sendResponded = require('./send-responded');
var Requests = require('../../service/requests');

function informUserRequestResponded(retrievedRequestData, client, line_userId, parsedData) { 
    var request = new Requests({});   
    if (retrievedRequestData != null) return sendResponded(retrievedRequestData, client, line_userId);
    request.updateToApproveDisapprove(parsedData);
    
}

module.exports = informUserRequestResponded;