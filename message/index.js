'use strict';
var Translator = require('../service/Translator')
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
        text: Translator().get('line.text.name', {username: body.user_name})  + "\n" +
              Translator().get('line.text.overtimeDate', {overtimedate: body.overtime_date}) + "\n" +
              Translator().get('line.text.overtimeTime', {overtimeTime: body.overtime_time}) + "\n" +
              Translator().get('line.text.overTimeReason', {overtimereason: body.overtime_reason}) + "\n",
        status: {
            approved: Translator().get('line.status.approved'),
            declined: Translator().get('line.status.declined')
        },
        label: {
            approve: Translator().get('line.label.approve'),
            decline: Translator().get('line.label.decline')
        }
    }

    return messageTemplate;
}

function cancelledMessageContent(body) {
    var messageTemplate = {
        header: Translator().get('line.header.cancelledMessage') + "\n",
        text: Translator().get('line.text.name', {username: body.user_name})  + "\n" +
        Translator().get('line.text.overtimeDate', {overtimedate: body.overtime_date}) + "\n" +
        Translator().get('line.text.overTimeReason', {overtimereason: body.reason}) + "\n",
    }

    return messageTemplate;
}

module.exports = Message;