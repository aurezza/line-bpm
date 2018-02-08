var localeChecker = require('../locale/locale-checker');
function success(router, lineID) {
    router.get('/success/:line_id', function(req, res) {
        var localeText = localeChecker('jp','success-message');
        var lineID = req.params.line_id;
        res.render('success', {
            title: localeText.successTextTitle, 
            description: localeText.successTextMessage,
            successButtonText: localeText.closeWindow,
            lineId: lineID
        });
   });
}

module.exports = success;