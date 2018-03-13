'use strict';
var express = require('express');
var router = express.Router();
var logger = require('../logger');
var mongoose = require('mongoose');
var connection = require('../mongo/connection');
var passport = require('passport');
var passportTmj = require('../passport/passport-tmj');
var apiValidation = require('../api-validation');
var generateToken = require('../api-validation/generate-token');
var verify = require('./verify');
var verifyUser = require('./verify/verify-user');
var success = require('./verify/success');
const line = require('@line/bot-sdk');
const config = {
    channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
    channelSecret: process.env.LINE_BOT_CHANNEL_SECRET,
};
const client = new line.Client(config);

var lineBotId = process.env.LINE_BOT_CHANNEL_ID;
        
var mongoDbURL = "mongodb://" + process.env.MONGODB_URL;
var mongoDbName = process.env.MONGODB_NAME;
const connectionURL = mongoDbURL + mongoDbName;

var receiver = require('./questetra/receiver');
var receiverCancelledRequest = require('./questetra/receiver-cancelled-request');
var LineController = require('../controller/line');
// db connection
connection(mongoose, connectionURL);

// passport
passportTmj();

// api token
apiValidation(router);
generateToken(router);

// verify page
verify(router, lineBotId);
verifyUser(router, client, logger, lineBotId);
success(router, lineBotId);

receiver(router, client);
receiverCancelledRequest(router, client);
var lc = new LineController();

router.post('/handler', lc.handler);


module.exports = router;

