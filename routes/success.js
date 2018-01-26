var localeChecker = require('../locale/localechecker');
function success(router) {
    router.get('/success', function(req, res) {
        var localeChecker = localechecker('jp','success-message');
        res.render('success', {
            title: localeChecker.successTextTitle, 
            description: localeChecker.successTextMessage
        });
   });
}

module.exports = success;