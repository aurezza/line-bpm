'use strict';
var logger = require('../logger');
var errorLocator = require('../node/error-locator');
var UserModel = require('../model/UserModel');
var userModel = new UserModel();
var LineService = require('../service/Line');
var lineService = new LineService();
var RequestModel = require('../model/RequestModel');
var requestModel = new RequestModel();
const line = require('@line/bot-sdk');
const config = {
    channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
    channelSecret: process.env.LINE_BOT_CHANNEL_SECRET,
};
const client = new line.Client(config);

function QuestetraController() {}

QuestetraController.prototype = {
    recieveFromQuest: recieveFromQuest,
    receiverCancelledRequest: receiverCancelledRequest
};

function recieveFromQuest(req, res) {
    var managerData = {};
    var users = userModel.retriveByEmpEmail(req.body.manager_email);
    
    users.then(function(users) {
        managerData = users;
        LineService.checkManagerDetails(managerData, req.body, client);  
    })
        .catch(function(error) {
            logger.error(error.message);
            logger.error(errorLocator());
        });
    res.send(true);      
}

function receiverCancelledRequest(req, res) {

    requestModel.updateToCancel(req.body)

    var managerData = {};
    var users = userModel.retriveByEmpEmail(req.body.manager_email);
    
    users.then(function(users) {
        managerData = users;
        lineService.sendCancelledRequest(managerData, req.body, client);  
    })
        .catch(function(error) {
            logger.error(error.message);
            logger.error(errorLocator());
        });
    res.send(true);


}

module.exports = QuestetraController;