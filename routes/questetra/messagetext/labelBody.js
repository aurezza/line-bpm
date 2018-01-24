var localechecker = require('../../locale/localechecker');
function labelText() 
{
    var localeText = localechecker('jp');
    return {
        Approve:localeText.label.Approve,
        Decline:localeText.label.Decline};
         }

module.exports = labelText;