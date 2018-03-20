'use strict';
var Translations = require('../service/Translation');
function Message () {
    
    if (!(this instanceof Message)) return new Message();
}

Message.prototype = {
    messageContent,
    cancelledMessageContent
};
var localeText = Translations().get('message-content');
function messageContent(body) 
{
    var messageTemplate = {
        text: localeText.text.name + " : " + body.user_name + "\n" +
                localeText.text.overtimeDate + " : " + body.overtime_date + "\n" +
                localeText.text.overtimeTime + " : " + body.overtime_time + "\n" +
                localeText.text.overTimeReason + " : " + body.overtime_reason + "\n",
        status: {
            approved: localeText.text.status + " : " + localeText.text.approved,
            declined: localeText.text.status + " : " + localeText.text.declined
        },
        label: {
            approve: localeText.label.approve,
            decline: localeText.label.decline
        }
    }

    return messageTemplate;
}

function cancelledMessageContent(body) {
    var messageTemplate = {
        header: localeText.header.cancelledMessage + "\n",
        text: localeText.text.name + " : " + body.user_name + "\n" +
        localeText.text.overtimeDate + " : " + body.overtime_date + "\n" +
        localeText.text.overTimeReason + " : " + body.reason + "\n",
    }

    return messageTemplate;
}

module.exports = Message;