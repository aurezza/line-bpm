var express = require('express');
var router = express.Router();
var logger = require('../logger');
var mongoose = require('mongoose');
var connection = require('../mongo/connection');
var passport = require('passport');
var passportTmj = require('../passport/passport-tmj');
var verify = require('./verify');
var verifyUser = require('./verify-user');
var retrieveUsers = require('./retrieve-users');
var success = require('./success');
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
var handler = require('./line/handler');

// db connection
connection(mongoose, connectionURL);

// passport
passportTmj();

// verify page
verify(router);
verifyUser(router, passport, client, logger);
success(router);
retrieveUsers();

receiver(router, client);
handler(router, axios, querystring, client);

module.exports = router;

