const line = require('@line/bot-sdk');

function Configuration() {
    
}

Configuration.prototype = {
    lineConfiguration: lineConfiguration,
    lineBotId: process.env.LINE_BOT_CHANNEL_ID
};


function lineConfiguration() {
    
    const config = {
        channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
        channelSecret: process.env.LINE_BOT_CHANNEL_SECRET,
    };
    const client = new line.Client(config);
    
    return client;
}


