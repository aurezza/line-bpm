var localeChecker = require('./locale/locale-checker');
function verify(router, lineID) {
    // use passport authentication module 
    // http://www.passportjs.org/
    router.get('/verify/:line_id', function(req, res) {
        var lineID = req.params.line_id;
        var localeText= localeChecker('jp','verify-content');
        res.render('verify', {
            title: localeText.pageTitle.title,
            panelTitle: localeText.label.panelTitle,
            verifyButtonText: localeText.button.verify,
            rememberMeText: localeText.label.rememberMe,
            usernamePlaceholder: localeText.placeHolder.username, 
            passwordPlaceholder: localeText.placeHolder.password,
            lineID: lineID
        });
   });

}

module.exports = verify;