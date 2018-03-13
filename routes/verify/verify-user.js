'use strict';
var checkValidatedUserData = require('./check-validated-user-data');
var localeChecker = require('../../locale/locale-checker');
var errorLocator = require('../../node/error-locator');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var AccessPassModel = require('../../model/access-pass');
// locale checker
var localeText = localeChecker('jp', 'verify-content');
var notEmpty = localeText.error.mustNotBeEmpty;

function verifyUser(router, client, logger, lineBotId) {
    // needs additional validation for schema
    var accessPass = new AccessPassModel();
    router.post('/verify/:token/:lineID', [
        check('username', notEmpty)
            .isLength({ min: 1})
            .trim()
            .withMessage(notEmpty),

        check('password')
            .isLength({ min: 1})
            .trim().withMessage(notEmpty),
    ],
    csrfProtection, 
    function(req, res) {
        var lineID = req.params.lineID;
        var token = req.params.token;
        var retrivedAccessPass = accessPass.retrieve(lineID, token);
        retrivedAccessPass
            .then(function(retrivedAccessPass) {
                if (retrivedAccessPass == null) {
                    return res.render('unauthorized-access', {
                        message: "Error : 403 - Unauthorized Access",
                    })
                }
                const errors = validationResult(req);
                // matchedData returns only the subset of data validated by the middleware
                const validatedUserData = matchedData(req);
                if (!errors.isEmpty()) {  
                    logger.warn('Field must not be empty');
                    return res.render('verify', {
                        title: localeText.pageTitle.title,
                        panelTitle: localeText.label.panelTitle,
                        verifyButtonText: localeText.button.verify,
                        usernamePlaceholder: localeText.placeHolder.username, 
                        passwordPlaceholder: localeText.placeHolder.password,
                        lineID: lineID,
                        token: token,
                        csrfToken: req.body._csrf,
                        username: validatedUserData.username,
                        verified: true,
                        error: errors.array({
                            onlyFirstError: true
                        }),
                        errors: {},
                        customError: ''
                    });
                }
    
                checkValidatedUserData(req, res, client, lineID, validatedUserData, lineBotId, token);            
            })
            .catch(function(error) {
                logger.error(error.message);
                logger.error(errorLocator());             
            })

    });
}

module.exports = verifyUser;