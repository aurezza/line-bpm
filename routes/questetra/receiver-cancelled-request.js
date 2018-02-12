'use strict';
var updateRequestToCancel = require('../update-request-to-cancel');
//var sendCancelledRequest = require('../line/send-cancelled-request');
function receiverCancelledRequest(router, client){
    router.post('/receiverCancelledRequest', function(req, res) {
        updateRequestToCancel(req.body);

        console.log("body",req.body);




    });
}

module.exports = receiverCancelledRequest;