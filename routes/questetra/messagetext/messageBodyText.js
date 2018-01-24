var localechecker = require('../locale/localechecker');
function messageBodyText(body) 
{
    var localeText = localechecker('jp');
    return
    localeText.text.Name +" : " + req.body.user_name + "\n"+
    localeText.text.OvertimeDate +" : " + req.body.overtime_date + "\n"+
    localeText.text.OvertimeTime +" : " + req.body.overtime_time + "\n"+
    localeText.text.OverTimeReason +" : " + req.body.overtime_reason + "\n";
}

module.exports = messageText;