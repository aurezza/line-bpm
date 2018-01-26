var localeChecker = require('./locale/localechecker');
function success(router) {
    router.get('/success', function(req, res) {
        var localeText = localeChecker('jp','success-message');
        res.render('success', {
            title: localeText.successTextTitle, 
            description: localeText.successTextMessage
        });
   });
}

module.exports = success;