'use strict';
var logger = require('../../logger');
var errorLocator = require('../node/error-locator');
var Users = require('../../service/users');
var Line = require('../../line/line');
var line = new Line();
function receiver(router, client) {
    router.post('/receiveFromQuest', function(req, res) {
        var user = new Users();
        var managerData = {};
        var users = user.retriveByEmpEmail(req.body.manager_email);
        
        users.then(function(users) {
            managerData = users;
            line.checkManagerDetails(managerData, req.body, client);  
        })
            .catch(function(error) {
                logger.error(error.message);
                logger.error(errorLocator());
            });
        res.send(true);      
    });
     
}
module.exports = receiver;