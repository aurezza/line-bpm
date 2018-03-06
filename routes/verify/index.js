var Users = require('../../service/users');
var localeChecker = require('../locale/locale-checker');
var logger = require('../../logger');
function verify(router, lineBotId) {
    router.get('/verify/:line_id', function(req, res) {
        var user = new Users();
        var lineID = req.params.line_id;
        var localeText = localeChecker('jp', 'verify-content');
        logger.info("verify page has loaded...");

        var users = user.retrieveByLineId(lineID);
        users
            .then(function(data) {
                if (data) {
                    logger.warn("The line ID:", lineID, "is already verified");
                    return res.render('verify-error', {
                        message: localeText.errorMessageLineIdExists,
                        backButtonText: localeText.button.back,
                        lineBotId: lineBotId
                    })
                }
                res.render('verify', {
                    title: localeText.pageTitle.title,
                    panelTitle: localeText.label.panelTitle,
                    verifyButtonText: localeText.button.verify,
                    usernamePlaceholder: localeText.placeHolder.username, 
                    passwordPlaceholder: localeText.placeHolder.password,
                    lineID: lineID,
                    verified: false,
                    errors: {},
                    customError: ''   
                });

            })
            .catch(function(err) {
                logger.error(err);;
            }); 
    });
}

module.exports = verify;