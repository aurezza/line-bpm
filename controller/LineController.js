'use strict';

var logger = require('../logger');
var errorLocator = require('../node/error-locator');
var UserModel = require('../model/UserModel');
var Line = require('../service/Line');
var Questetra = require('../service/Questetra');
const line = require('@line/bot-sdk');
const config = {
    channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
    channelSecret: process.env.LINE_BOT_CHANNEL_SECRET,
};

const client = new line.Client(config);

function LineController () {
    if (!(this instanceof LineController)) return new LineController();
}

LineController.prototype = {
    eventTrigger: eventTrigger
};

function eventTrigger(req, res) {
    var eventType = req.body.events[0].type;
    eventHandler[eventType]({
        req: req.body, 
        client: client
    })
    res.send(true);
}

var eventHandler = {};

eventHandler.follow = function (params) {
    logger.info("follow event triggered");
    let line_userId = params.req.events[0].source.userId;
    var users = UserModel().retrieveByLineId(line_userId);
    users
        .then(function (users) {
            if (users) return  Line().userExist(params.client, line_userId, users.employee_name);
            Line().scanQrCode(params.client, line_userId);
        })
        .catch(function (error) {
            logger.error(error.message);
            logger.error(errorLocator());
        });
}

eventHandler.postback = function(params) {
    logger.info("postback event triggered");
    //postBack is data query params depending on manager reply
    let line_userId = params.req.events[0].source.userId;
    var postBack = params.req.events[0].postback;
    Questetra().outgoingMessage(postBack, params.client, line_userId);
}

eventHandler.unfollow = function(params) {logger.info("unfollow event triggered");};
eventHandler.message = function(params) {logger.info("message event triggered");};

module.exports = LineController;