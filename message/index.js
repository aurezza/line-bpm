'use strict';
var Translator = require('../service/Translator')
function Message () {
    if (!(this instanceof Message)) return new Message();
    this.translator = Translator()
}

Message.prototype = {
    messageContent,
    cancelledMessageContent
};
function messageContent(body) 
{
    var messageTemplate = {
        text: this.translator.get('line.text.name', {username: body.user_name})  + "\n" +
        this.translator.get('line.text.overtimeDate', {overtimedate: body.overtime_date}) + "\n" +
        this.translator.get('line.text.overtimeTime', {overtimeTime: body.overtime_time}) + "\n" +
        this.translator.get('line.text.overTimeReason', {overtimereason: body.overtime_reason}) + "\n",
        status: {
            approved: this.translator.get('line.status.approved'),
            declined: this.translator.get('line.status.declined')
        },
        label: {
            approve: this.translator.get('line.label.approve'),
            decline: this.translator.get('line.label.decline')
        }
    }

    return messageTemplate;
}

function cancelledMessageContent(body) {
    var messageTemplate = {
        header: this.translator.get('line.header.cancelledMessage') + "\n",
        text: this.translator.get('line.text.name', {username: body.user_name})  + "\n" +
        this.translator.get('line.text.overtimeDate', {overtimedate: body.overtime_date}) + "\n" +
        this.translator.get('line.text.overTimeReason', {overtimereason: body.reason}) + "\n",
    }

    return messageTemplate;
}

module.exports = Message;