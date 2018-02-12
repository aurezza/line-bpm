var localeChecker = require('../../locale/locale-checker');

function cancelledMessageContent(body){
    var localeText = localeChecker('jp','message-content');
    console.log("localeText",localeText);
    console.log("body",body);
    var messageTemplate = {
        header: localeText.header.cancelledMessage + "\n",
        text :  localeText.text.name +" : " + body.user_name + "\n"+
        localeText.text.overtimeDate +" : " + body.overtime_date + "\n"+
        localeText.text.overTimeReason +" : " + body.reason + "\n",
    }
}

module.exports = cancelledMessageContent;