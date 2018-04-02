'use strict';
var logger = require('../logger');
var errorLocator = require('../node/error-locator');
var UserModel = require('../model/UserModel');
var Line = require('../service/Line');
var Questetra = require('../service/Questetra');

var LineConfiguration = require('../config/line');
const line = require('@line/bot-sdk');
// const config = {
//     channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
//     channelSecret: process.env.LINE_BOT_CHANNEL_SECRET,
// };
const client = new line.Client(LineConfiguration.api); 
// const client = new line.Client(config);

function LineController () {
    if (!(this instanceof LineController)) return new LineController();
}

LineController.prototype = {
    eventTrigger,
    follow,
    unfollow,
    postback,
    message
};

function eventTrigger(req, res) {
    var self = LineController();
    var eventType = req.body.events[0].type;
    self[eventType]({
        req: req.body, 
        client: client
    });
    res.send(true);
}

function follow(params) {
    logger.info("follow event triggered");
    let line_userId = params.req.events[0].source.userId;
    var users = UserModel().retrieveByLineId(line_userId);
    users
        .then(function (data) {
            logger.info('UserModel users: ', data);
            if (data) return  Line().userExist(params.client, line_userId, data.employee_name);
            Line().scanQrCode(params.client, line_userId);
        })
        .catch(function (error) {
            logger.error(error.message);
            logger.error(errorLocator());
        });
}

function postback(params) {
    logger.info("postback event triggered");
    //postBack is data query params depending on manager reply
    let line_userId = params.req.events[0].source.userId;
    var postBack = params.req.events[0].postback;
    Questetra().outgoingMessage(postBack, params.client, line_userId);
}

function unfollow(params) {logger.info("unfollow event triggered");};
function message(params) {logger.info("message event triggered");};

module.exports = LineController;