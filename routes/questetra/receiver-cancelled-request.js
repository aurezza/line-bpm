'use strict';
var logger = require('../../logger');
var updateRequestToCancel = require('../update-request-to-cancel');

function receiverCancelledRequest(router, client){
    router.post('/receiverCancelledRequest', function(req, res) {
        console.log('req.body receiverCancelledRequest',req.body);
        updateRequestToCancel(req.body)
    });
}

module.exports = receiverCancelledRequest;