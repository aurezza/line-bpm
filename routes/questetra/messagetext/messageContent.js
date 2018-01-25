var localechecker = require('../../locale/localechecker');
function messageContent(body) 
{
    var localeText = localechecker('jp','receiver');

    var messageTemplate = {
            text :  localeText.text.Name +" : " + body.user_name + "\n"+
                    localeText.text.OvertimeDate +" : " + body.overtime_date + "\n"+
                    localeText.text.OvertimeTime +" : " + body.overtime_time + "\n"+
                    localeText.text.OverTimeReason +" : " + body.overtime_reason + "\n",
            status : {
                Approved:localeText.text.Status +" : " +localeText.text.Approved,
                Declined:localeText.text.Status +" : " +localeText.text.Declined
                },
            label : {
                Approve:localeText.label.Approve,
                Decline:localeText.label.Decline
                }
            }

    return messageTemplate;
}

module.exports = messageContent;