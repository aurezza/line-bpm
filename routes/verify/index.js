'use strict';
var logger = require('../../logger');
var errorLocator = require('../../node/error-locator');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var UserModel = require('../../model/UserModel');
var AccessPassModel = require('../../model/AccessPassModel');
var translator = require('../../service/translator');
function verify(router, lineBotId) {
    router.get('/verify/:token/:line_id', csrfProtection, function(req, res) {
        var lineID = req.params.line_id;
        var token = req.params.token;
        var users = UserModel().retrieveByLineId(lineID);    
        users.then(function(users) {
            if (users) {
                logger.warn("The line ID:", lineID, "is already verified");
                return res.render('verify-error', {
                    message: translator('verify.errorMessageLineIdExists'),
                    backButtonText: translator('verify.button.back'),
                    lineBotId: lineBotId
                })
            }
            var retrievedAccessPass = AccessPassModel().retrieve(lineID, token);
            retrievedAccessPass
                .then(function(retrievedAccessPass) {
                    if (retrievedAccessPass == null) {
                        return res.render('unauthorized-access', {
                            message: translator('verify.error.unauthorizedAccess'),
                        })
                    }
                    logger.info("verify page has loaded...");   
                    res.render('verify', {
                        title: translator('verify.pageTitle.verify'),
                        panelTitle: translator('verify.label.panelTitle'),
                        verifyButtonText: translator('verify.button.verify'),
                        usernamePlaceholder: translator('verify.placeHolder.username'), 
                        passwordPlaceholder: translator('verify.placeHolder.password'),
                        lineID: lineID,
                        token: token,
                        csrfToken: req.csrfToken(),
                        verified: false,
                        errors: {},
                        customError: ''   
                    });    
                })
                .catch(function(error) {
                    logger.error(error.message);
                    logger.error(error.stack);
                }); 
        })
            .catch(function(error) {
                logger.error(error.message);
                logger.error(errorLocator());          
            }); 
    });
}

module.exports = verify;