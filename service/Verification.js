'use strict';

var logger = require('../logger');

var LineService = require('./Line');

var LineConfiguration = require('../config/line');
var line = require('@line/bot-sdk');
var client = new line.Client(LineConfiguration.api); 

function Verification() {
    if (!(this instanceof Verification)) return new Verification();
}

Verification.prototype = {
    successVerifyLineMessage
};

function successVerifyLineMessage(lineID)
{
    logger.info(lineID + " has been successfully verified");
    var self = this;
    const message = {
        type: 'text',
        text: self.translator.get('verify.successTextMessage'),
    };
       
    LineService().clientPushMessage(client, lineID, message, false);
    
}

module.exports = Verification;
