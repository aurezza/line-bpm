var localechecker = require('../../locale/localechecker');
function messageStatus() 
{
    var localeText = localechecker('jp');
    return {
        Approved:localeText.text.Status +" : " +localeText.text.Approved,
        Declined:localeText.text.Status +" : " +localeText.text.Declined};
         }

module.exports = messageStatus;