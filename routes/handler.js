'use strict';
var express = require('express');
var router = express.Router();
var logger = require('../logger');
var mongoose = require('mongoose');
var connection = require('../mongo/connection');
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
var LineController = require('../controller/LineController');
var QuestetraController = require('../controller/QuestetraController');
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

router.post('/receiverCancelledRequest', QuestetraController().receiverCancelledRequest);
router.post('/receiveFromQuest', QuestetraController().recieveFromQuest);
router.post('/handler', LineController().eventTrigger);

module.exports = router;