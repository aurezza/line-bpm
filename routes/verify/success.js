var localeChecker = require('../locale/locale-checker');
function success(router) {
    router.get('/success', function(req, res) {
        var localeText = localeChecker('jp','success-message');
        var lineBotId = process.env.LINE_BOT_CHANNEL_ID;
        res.render('success', {
            title: localeText.successTextTitle, 
            description: localeText.successTextMessage,
            successButtonText: localeText.closeWindow,
            lineBotId: lineBotId
        });
   });
}

module.exports = success;