'use strict';
var logger = require('../../logger');

function receiverCancelledRequest(router, client){
    router.post('/receiverCancelledRequest', function(req, res) {
        console.log('req.body receiverCancelledRequest',req.body);
    });
}

module.exports = receiverCancelledRequest;