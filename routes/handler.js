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
const line = require('@line/bot-sdk');
const config = {
    channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
    channelSecret: process.env.LINE_BOT_CHANNEL_SECRET,
};
const client = new line.Client(config);
        
var mongoDbURL = "mongodb://" + process.env.MONGODB_URL;
var mongoDbName = process.env.MONGODB_NAME;
const connectionURL = mongoDbURL + mongoDbName;

var axios = require('axios');
var querystring = require('querystring');
var receiver = require('./questetra/receiver');
var receiverCancelledRequest = require('./questetra/receiver-cancelled-request');
var handler = require('./line/handler');

var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

var VerifyPageController = require('../controllers/VerifyPageController');
// var renderVerify = new Verify();

// db connection
connection(mongoose, connectionURL);

// passport
passportTmj();

// api token
apiValidation(router);
generateToken(router);

// verify page
router.get('/verify/:token/:line_id', csrfProtection, VerifyPageController().showPage);
verify(router);
router.get('/success', VerifyPageController().showSuccess);

receiver(router, client);
receiverCancelledRequest(router, client);
handler(router, axios, querystring, client);

module.exports = router;

