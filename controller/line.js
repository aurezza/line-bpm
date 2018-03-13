'use strict';

var logger = require('../logger');
var errorLocator = require('../node/error-locator');
var UserModel = require('../model/users');
var userModel = new UserModel();
var Line = require('../service/line');
var lineService = new Line();
var Questetra = require('../service/questetra');
var questetra = new Questetra();
const line = require('@line/bot-sdk');
const config = {
    channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
    channelSecret: process.env.LINE_BOT_CHANNEL_SECRET,
};

const client = new line.Client(config);


function LineController () {
    function test(req, res) {
        var eventType = req.body.events[0].type;
        eventHandler[eventType]({
            req: req.body, 
            client: client
        })
        res.send(true);
    }
    
    return test;
}

var eventHandler = {};

eventHandler.follow = function (params) {
    logger.info("follow event triggered");
    let line_userId = params.req.events[0].source.userId;
    var users = userModel.retrieveByLineId(line_userId);
    users
        .then(function (users) {
            if (users) return  lineService.userExist(params.client, line_userId, users.employee_name);
            lineService.scanQrCode(params.client, line_userId);
        })
        .catch(function (error) {
            logger.error(error.message);
            logger.error(errorLocator());
        });
}

// function postback(params) {
//     logger.info("postback event triggered");
//     //postBack is data query params depending on manager reply
//     let line_userId = params.req.events[0].source.userId;
//     var postBack = params.req.events[0].postback;
//     questetra.outgoingMessage(postBack, params.client, line_userId);
// }

// function unfollow(params) {logger.info("unfollow event triggered");};
// function message(params) {logger.info("message event triggered");};

module.exports = LineController;