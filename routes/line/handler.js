'use strict';
var logger = require('../../logger');
var errorLocator = require('../node/error-locator');
var Users = require('../../service/users');
var Line = require('../../line/line');
var line = new Line();
var Sender = require('../../line/sender');
var sender = new Sender();
var Node = require('../../line/node');
var node = new Node();
function Controller(params) {
    this.body = params.body;
    this.client = params.client;  
}

Controller.prototype = {
    eventHandler: {
        follow: follow,
        unfollow: unfollow
    }
    
};

function follow() {
    var user = new Users();
    let line_userId = this.body.events[0].source.userId;
    var users = user.retrieveByLineId(line_userId);
    users
        .then(function (users) {
            if (users) return  sender.userExist(this.client, line_userId, users.employee_name);
            line.scanQrCode(this.client, line_userId);
        })
        .catch(function (error) {
            logger.error(error.message);
            logger.error(errorLocator());
        });
}

function unfollow() {
    logger.info("unfollow event");    
}

function handler(router, axios, querystring, client) {
    router.post('/handler', function(req, res) {
        var eventType = req.body.events[0].type;
        var ctrl = new Controller({
            body: req.body, 
            client: client
        });  
        ctrl.eventHandler[eventType]();
        res.send(true);
    });
}


var eventHandler = {};
eventHandler.follow = function(params) {
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
eventHandler.postback = function(params) {
    //postBack is data query params depending on manager reply
    let line_userId = params.req.events[0].source.userId;
    var postBack = params.req.events[0].postback;
    node.outgoingMessage(postBack, params.client, line_userId);
}

eventHandler.unfollow = function(params) {logger.info("unfollow event");};
eventHandler.message = function(params) {logger.info("message event");};
module.exports = handler;