'use strict';
var sendResponded = require('./send-responded');
function informUserRequestResponded(retrievedRequestData,client,line_userId){
    if (Object.keys(retrievedRequestData).length) return sendResponded(client,line_userId);

}

module.exports = informUserRequestResponded;