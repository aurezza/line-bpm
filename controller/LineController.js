'use strict';
var LineEventHandler = require('../service/LineEventHandler')
const line = require('@line/bot-sdk');
const config = {
    channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
    channelSecret: process.env.LINE_BOT_CHANNEL_SECRET,
};

const client = new line.Client(config);

function LineController () {
    if (!(this instanceof LineController)) return new LineController();
}

LineController.prototype = {
    eventTrigger: eventTrigger
};

function eventTrigger(req, res) {
    var eventType = req.body.events[0].type;
    LineEventHandler().eventHandler[eventType]({
        req: req.body, 
        client: client
    });
    
    res.send(true);
}


module.exports = LineController;