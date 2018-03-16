'use strict';

var config = {
    api: {
        channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
        channelSecret: process.env.LINE_BOT_CHANNEL_SECRET
    },
    lineBotId: process.env.LINE_BOT_CHANNEL_ID
}

module.exports = config;


