'use strict';
var logger = require('../../logger');
var errorLocator = require('../node/error-locator');
var Requests = require('../../service/requests')
var Users = require('../../service/users');
var Request = require('../../line/request');
function receiverCancelledRequest(router, client) {
    router.post('/receiverCancelledRequest', function(req, res) {
        var request = new Request();
        var requests = new Requests ();
        var user = new Users();
        requests.updateToCancel(req.body)

        var managerData = {};
        var users = user.retriveByEmpEmail(req.body.manager_email);
        
        users.then(function(users) {
            managerData = users;
            request.sendCancelledRequest(managerData, req.body, client);  
        })
            .catch(function(error) {
                logger.error(error.message);
                logger.error(errorLocator());
            });
        res.send(true);


    });
}

module.exports = receiverCancelledRequest;