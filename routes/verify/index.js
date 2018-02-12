var retrieveUsers = require('../retrieve-users');
var localeChecker = require('../locale/locale-checker');
var logger = require('../../logger');
function verify(router, lineID, lineBotId) {
    router.get('/verify/:line_id', function(req, res) {
        var lineID = req.params.line_id;
        var localeText= localeChecker('jp','verify-content');
        logger.info("verify page has loaded...");

        var users = retrieveUsers(lineID, 'empty');
        users.then(function(users){
            if (users){
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
        .catch(function(err){
            logger.error(err);;
        }); 
   });
}

module.exports = verify;