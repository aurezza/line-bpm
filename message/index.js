'use strict';
var translator = require('../service/translator')
function Message () {
    
    if (!(this instanceof Message)) return new Message();
}

Message.prototype = {
    messageContent,
    cancelledMessageContent
};
function messageContent(body) 
{
    var messageTemplate = {
        text: translator('line.text.name', {username: body.user_name})  + "\n" +
              translator('line.text.overtimeDate', {overtimedate: body.overtime_date}) + "\n" +
              translator('line.text.overtimeTime', {overtimeTime: body.overtime_time}) + "\n" +
              translator('line.text.overTimeReason', {overtimereason: body.overtime_reason}) + "\n",
        status: {
            approved: translator('line.status.approved'),
            declined: translator('line.status.declined')
        },
        label: {
            approve: translator('line.label.approve'),
            decline: translator('line.label.decline')
        }
    }

    return messageTemplate;
}

function cancelledMessageContent(body) {
    var messageTemplate = {
        header: translator('line.header.cancelledMessage') + "\n",
        text: translator('line.text.name') + " : " + body.user_name + "\n" +
        translator('line.text.overtimeDate') + " : " + body.overtime_date + "\n" +
        translator('line.text.overTimeReason') + " : " + body.reason + "\n",
    }

    return messageTemplate;
}

module.exports = Message;