'use strict';
var updateRequestToCancel = require('../update-request-to-cancel');
var sendCancelledRequest = require('../line/sender-cancelled-request');
var retrieveUser = require('../retrieve-users');
var logger = require('../../logger');
function receiverCancelledRequest(router, client){
    router.post('/receiverCancelledRequest', function(req, res) {

        updateRequestToCancel(req.body);

        var managerData = {};
        var users = retrieveUser('empty',req.body.manager_email);
        
        users.then(function(users){
          managerData = users;
          sendCancelledRequest(managerData, req.body, client);  
        })
        .catch(function(err){
            logger.error(err);
        });



    });
}

module.exports = receiverCancelledRequest;