'use strict';
var updateRequestToCancel = require('../update-request-to-cancel');
var sendCancelledRequest = require('../line/sender-cancelled-request');
function receiverCancelledRequest(router, client){
    router.post('/receiverCancelledRequest', function(req, res) {
        updateRequestToCancel(req.body);

        console.log("body",req.body);




    });
}

module.exports = receiverCancelledRequest;