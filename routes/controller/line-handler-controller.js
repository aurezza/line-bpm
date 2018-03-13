'use strict';
var logger = require('../../logger');
var LineController = require('../../controller/line');

const config = {
    channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
    channelSecret: process.env.LINE_BOT_CHANNEL_SECRET,
};
const client = new line.Client(config);
const line = require('@line/bot-sdk');

function testController (req, res) {

}