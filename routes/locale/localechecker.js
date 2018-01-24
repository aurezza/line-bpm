var japanese = require('../locale/jp/receiverJp');
var english = require('../locale/en/receiverEng');

function localechecker(){      
        text = {  
            Name:japanese.Name,
            OvertimeDate:japanese.OvertimeDate,
            OvertimeTime:japanese.OvertimeTime,
            OverTimeReason:japanese.OverTimeReason,
            Approved:japanese.Approved,
            Declined:japanese.Declined,
            Status:japanese.Status
                };
        label = {
            Approve:japanese.Approve,
            Decline:japanese.Decline,
            };     

    var localetext = {text:text,label:label};
    return localetext;
}

module.exports = localechecker;
