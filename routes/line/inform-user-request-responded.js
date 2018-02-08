'use strict';
var sendResponded = require('./send-responded');
function informUserRequestResponded(retrievedRequestData){
    if (Object.keys(retrievedRequestData).length) return sendResponded(client,line_userId);

}

module.exports = informUserRequestResponded;