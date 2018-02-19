'use strict';
var retrieveUser = require('../retrieve-users');
var logger = require('../../logger');
var checkManagerDetails = require('../line/checker-of-manager-details');
var errorLocator = require('../node/error-locator');
function receiver(router, client){
    router.post('/receiveFromQuest', function(req, res) {
        var managerData = {};
        var users = retrieveUser('empty',req.body.manager_email);
        
        users.then(function(users){
          managerData = users;
          checkManagerDetails(managerData, req.body, client);  
        })
        .catch(function(error){
            logger.error(error.message);
            logger.error(errorLocator());
        });
        res.send(true);      
    });
     
}
module.exports = receiver;