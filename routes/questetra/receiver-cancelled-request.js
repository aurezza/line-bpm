'use strict';
var updateRequestToCancel = require('../update-request-to-cancel');

function receiverCancelledRequest(router, client){
    router.post('/receiverCancelledRequest', function(req, res) {
        updateRequestToCancel(req.body);
    });
}

module.exports = receiverCancelledRequest;