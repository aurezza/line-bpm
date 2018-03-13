'use strict';
var logger = require('../../logger');
var errorLocator = require('../node/error-locator');
var RequestModel = require('../../model/requests')
var UserModel = require('../../model/users');
var LineRequest = require('../../line/request');
function receiverCancelledRequest(router, client) {
    router.post('/receiverCancelledRequest', function(req, res) {
        var lineRequest = new LineRequest();
        var requestModel = new RequestModel ();
        var userModel = new UserModel();
        requestModel.updateToCancel(req.body)

        var managerData = {};
        var users = userModel.retriveByEmpEmail(req.body.manager_email);
        
        users.then(function(users) {
            managerData = users;
            lineRequest.sendCancelledRequest(managerData, req.body, client);  
        })
            .catch(function(error) {
                logger.error(error.message);
                logger.error(errorLocator());
            });
        res.send(true);


    });
}

module.exports = receiverCancelledRequest;