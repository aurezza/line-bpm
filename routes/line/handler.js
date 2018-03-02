'use strict';
var scanQrCode = require('./scan-qr-code');
var informUserExistence = require('./user-inform-if-exist');
var toNode = require('./to-node');
var retrieveUserByLineId = require('.././retrieve-user-by-line-id');
var logger = require('../../logger');
var errorLocator = require('../node/error-locator');

function handler(router, axios, querystring, client) {
    router.post('/handler', function(req, res) {
        var eventType = req.body.events[0].type;        
        eventHandler[eventType]({req: req.body, client: client});
        res.send(true);
    });
}

var eventHandler = {};
eventHandler.follow = function(params) {
    let line_userId = params.req.events[0].source.userId;
    var users = retrieveUserByLineId(line_userId);
    users
        .then(function (users) {
            if (users) return  informUserExistence(params.client, line_userId, users.employee_name);
            scanQrCode(params.client, line_userId);
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
    toNode(postBack, params.client, line_userId);
}

eventHandler.unfollow = function(params) {logger.info("unfollow event");};
eventHandler.message = function(params) {logger.info("message event");};
module.exports = handler;