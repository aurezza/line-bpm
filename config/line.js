'use strict';

// const line = require('@line/bot-sdk');

// function Configuration() {
//     this.lineBotId = process.env.LINE_BOT_CHANNEL_ID;
//     if (!(this instanceof Configuration)) return new Configuration();
    
// }

// Configuration.prototype = {
//     lineConfiguration: lineConfiguration
// };


// function lineConfiguration() {
    
//     const config = [
//         {
//             channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
//             channelSecret: process.env.LINE_BOT_CHANNEL_SECRET
//         }

//     ];
    
//     return config;
// }


var config = {
    channel: {
        accessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
        secret: process.env.LINE_BOT_CHANNEL_SECRET
    },
    lineBotId: process.env.LINE_BOT_CHANNEL_ID
}

module.exports = config;


