var localeChecker = require('../locale/locale-checker');
function success(router, lineID) {
    router.get('/success', function(req, res) {
        var localeText = localeChecker('jp','success-message');
        res.render('success', {
            title: localeText.successTextTitle, 
            description: localeText.successTextMessage,
            successButtonText: localeText.closeWindow,
            lineId: lineID
        });
   });
}

module.exports = success;