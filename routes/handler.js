var express = require('express');
var router = express.Router();
var verify = require('./verify');
var success = require('./success');
const line = require('@line/bot-sdk');
const config = {
  channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
  channelSecret: process.env.LINE_BOT_CHANNEL_SECRET,
};
const client = new line.Client(config);
var axios = require('axios');
var querystring = require('querystring');
var receiver = require('./questetra/receiver');
var handler = require('./line/handler');

// verify page
verify(router);
success(router);

receiver({router, client, axios, querystring,});
handler(router, axios, querystring, client);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

