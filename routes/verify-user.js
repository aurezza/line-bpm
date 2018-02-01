var checkValidatedUserData = require('./check-validated-user-data');
var localeChecker = require('./locale/locale-checker'); 
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

// locale checker
var localeText= localeChecker('jp','verify-content');
var notEmpty = localeText.error.mustNotBeEmpty;

function verifyUser(router, passport, logger){
    // needs additional validation for schema
    router.post('/verify/:lineID', [
        check('username', notEmpty)
        .isLength({ min: 1})
        .trim()
        .withMessage(notEmpty),

        check('password')
        .isLength({ min: 1})
        .trim().withMessage(notEmpty),
    ], 
    function(req, res){
        var lineID = req.params.lineID;

        const errors = validationResult(req);
        // matchedData returns only the subset of data validated by the middleware
        const validatedUserData = matchedData(req);

        if (!errors.isEmpty()) {  
            return res.render('verify',{
                title: localeText.pageTitle.title,
                panelTitle: localeText.label.panelTitle,
                verifyButtonText: localeText.button.verify,
                usernamePlaceholder: localeText.placeHolder.username, 
                passwordPlaceholder: localeText.placeHolder.password,
                lineID: lineID,
                username: validatedUserData.username,
                error: errors.array({
                    onlyFirstError: true
                })
            });
        }

        checkValidatedUserData(passport, req, res, lineID, validatedUserData);
    });
}

module.exports = verifyUser;