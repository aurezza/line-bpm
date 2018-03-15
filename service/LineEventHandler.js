'use strict';
var logger = require('../logger');
var errorLocator = require('../node/error-locator');
var UserModel = require('../model/UserModel');
var Line = require('../service/Line');
var Questetra = require('../service/Questetra');

function LineEventHandler() {
    if (!(this instanceof LineEventHandler)) return new LineEventHandler();
}

LineEventHandler.prototype = {
    eventHandler: {
        follow: follow,
        unfollow: unfollow,
        postback: postback,
        message: message
    }
};

function follow(params) {
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

function postback(params) {
    logger.info("postback event triggered");
    //postBack is data query params depending on manager reply
    let line_userId = params.req.events[0].source.userId;
    var postBack = params.req.events[0].postback;
    Questetra().outgoingMessage(postBack, params.client, line_userId);
}

function unfollow(params) {logger.info("unfollow event triggered");};
function message(params) {logger.info("message event triggered");};


module.exports = LineEventHandler;
