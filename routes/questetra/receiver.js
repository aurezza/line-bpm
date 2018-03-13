'use strict';
var logger = require('../../logger');
var errorLocator = require('../../node/error-locator');
var UserModel = require('../../model/users');
var Line = require('../../service/line')();

function receiver(router, client) {
    router.post('/receiveFromQuest', function(req, res) {
        var userModel = new UserModel();
        var managerData = {};
        var users = userModel.retriveByEmpEmail(req.body.manager_email);
        
        users.then(function(users) {
            managerData = users;
            Line.checkManagerDetails(managerData, req.body, client);  
        })
            .catch(function(error) {
                logger.error(error.message);
                logger.error(errorLocator());
            });
        res.send(true);      
    });
     
}
module.exports = receiver;