var localechecker = require('../../locale/locale-checker');
function messageContent(body) 
{
    var localeText = localechecker('jp','message-content');

    var messageTemplate = {
            text :  localeText.text.name +" : " + body.user_name + "\n"+
                    localeText.text.overtimeDate +" : " + body.overtime_date + "\n"+
                    localeText.text.overtimeTime +" : " + body.overtime_time + "\n"+
                    localeText.text.overTimeReason +" : " + body.overtime_reason + "\n",
            status : {
                approved:localeText.text.status +" : " +localeText.text.approved,
                declined:localeText.text.status +" : " +localeText.text.declined
                },
            label : {
                approve:localeText.label.approve,
                decline:localeText.label.decline
                }
            }

    return messageTemplate;
}

module.exports = messageContent;