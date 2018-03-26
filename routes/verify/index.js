'use strict';
var logger = require('../../logger');
var errorLocator = require('../../node/error-locator');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var UserModel = require('../../model/UserModel');
var AccessPassModel = require('../../model/AccessPassModel');
var Translator = require('../../service/Translator');
function verify(router, lineBotId) {
    router.get('/verify/:token/:line_id', csrfProtection, function(req, res) {
        this.translator  = Translator();
        var lineID = req.params.line_id;
        var token = req.params.token;
        var users = UserModel().retrieveByLineId(lineID);    
        users.then(function(users) {
            if (users) {
                logger.warn("The line ID:", lineID, "is already verified");
                return res.render('verify-error', {
                    message: this.translator.get('verify.errorMessageLineIdExists'),
                    backButtonText: this.translator.get('verify.button.back'),
                    lineBotId: lineBotId
                })
            }
            var retrievedAccessPass = AccessPassModel().retrieve(lineID, token);
            retrievedAccessPass
                .then(function(retrievedAccessPass) {
                    if (retrievedAccessPass == null) {
                        return res.render('unauthorized-access', {
                            message: this.translator.get('verify.error.unauthorizedAccess'),
                        })
                    }
                    logger.info("verify page has loaded..."); 
                    res.render('verify', {
                        title: this.translator.get('verify.title'),
                        panelTitle: this.translator.get('verify.label.panelTitle'),
                        verifyButtonText: this.translator.get('verify.button.verify'),
                        usernamePlaceholder: this.translator.get('verify.placeHolder.username'), 
                        passwordPlaceholder: this.translator.get('verify.placeHolder.password'),
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