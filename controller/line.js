'use strict';

var logger = require('../logger');
var errorLocator = require('../routes/node/error-locator');
var Users = require('../service/users');
var Line = require('../line/line');
var line = new Line();
var Sender = require('../line/sender');
var sender = new Sender();
var Node = require('../line/node');
var node = new Node();


function Controller() {}

Controller.prototype = {
    eventHandler: {
        follow: follow,
        unfollow: unfollow
    }
    
};

function follow(params) {
    var user = new Users();
    let line_userId = params.req.events[0].source.userId;
    var users = user.retrieveByLineId(line_userId);
    users
        .then(function (users) {
            if (users) return  sender.userExist(params.client, line_userId, users.employee_name);
            line.scanQrCode(params.client, line_userId);
        })
        .catch(function (error) {
            logger.error(error.message);
            logger.error(errorLocator());
        });
}

function unfollow(params) {
    logger.info("message event");    
}


module.exports = Controller;