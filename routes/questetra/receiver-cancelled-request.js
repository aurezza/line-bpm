'use strict';
var logger = require('../../logger');
var errorLocator = require('../../node/error-locator');
var RequestModel = require('../../model/requests')
var UserModel = require('../../model/users');
var Line = require('../../service/line');
function receiverCancelledRequest(router, client) {
    router.post('/receiverCancelledRequest', function(req, res) {
        var line = new Line();
        var requestModel = new RequestModel ();
        var userModel = new UserModel();
        requestModel.updateToCancel(req.body)

        var managerData = {};
        var users = userModel.retriveByEmpEmail(req.body.manager_email);
        
        users.then(function(users) {
            managerData = users;
            line.sendCancelledRequest(managerData, req.body, client);  
        })
            .catch(function(error) {
                logger.error(error.message);
                logger.error(errorLocator());
            });
        res.send(true);


    });
}

module.exports = receiverCancelledRequest;