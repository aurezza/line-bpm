'use strict';
var sendCancelledRequest = require('../line/sender-cancelled-request');
var logger = require('../../logger');
var errorLocator = require('../node/error-locator');
var Requests = require('../../service/requests')
var Users = require('../../service/users');
function receiverCancelledRequest(router, client) {
    router.post('/receiverCancelledRequest', function(req, res) {
        var request = new Requests ();
        var user = new Users();
        request.updateToCancel(req.body)

        var managerData = {};
        var users = user.retriveByEmpEmail(req.body.manager_email);
        
        users.then(function(users) {
            managerData = users;
            sendCancelledRequest(managerData, req.body, client);  
        })
            .catch(function(error) {
                logger.error(error.message);
                logger.error(errorLocator());
            });
        res.send(true);


    });
}

module.exports = receiverCancelledRequest;