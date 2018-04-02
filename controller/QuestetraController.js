'use strict';
var logger = require('../logger');
var errorLocator = require('../node/error-locator');
var UserModel = require('../model/UserModel');
var LineService = require('../service/Line');
var RequestModel = require('../model/RequestModel');
var LineConfiguration = require('../config/line');
const line = require('@line/bot-sdk');
// const config = {
//     channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
//     channelSecret: process.env.LINE_BOT_CHANNEL_SECRET,
// };
const client = new line.Client(LineConfiguration.api); 
// const client = new line.Client(config);

function QuestetraController() {
    if (!(this instanceof QuestetraController)) return new QuestetraController();
}

QuestetraController.prototype = {
    recieveFromQuest,
    receiverCancelledRequest
};

function recieveFromQuest(req, res) {
    logger.info("recieveFromQuest accessed");
    var managerData = {};
    var users = UserModel().retriveByEmpEmail(req.body.manager_email);
    
    users.then(function(data) {
        managerData = data;
        LineService().checkManagerDetails(managerData, req.body, client);  
    })
        .catch(function(error) {
            logger.error(error.message);
            logger.error(errorLocator());
        });
    res.send(true);      
}

function receiverCancelledRequest(req, res) {
    logger.info("receiverCancelledRequest accessed");

    RequestModel().updateToCancel(req.body)

    var managerData = {};
    var users = UserModel().retriveByEmpEmail(req.body.manager_email);
    
    users.then(function(users) {
        managerData = users;
        LineService().sendCancelledRequest(managerData, req.body, client);  
    })
        .catch(function(error) {
            logger.error(error.message);
            logger.error(errorLocator());
        });
    res.send(true);


}

module.exports = QuestetraController;