'use strict';

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

var logger = require('../logger');
var errorLocator = require('../node/error-locator');
var Translator = require('../service/Translator');
var RenderPage = require('../service/RenderPages');
var Verification = require('../service/Verification');
var UserModel = require('../model/UserModel');
var AccessPassModel = require('../model/AccessPassModel');

function VerifyPageController() {
    if (!(this instanceof VerifyPageController)) return new VerifyPageController();
    this.translator = Translator();
}

VerifyPageController.prototype = {
    expressValidator,
    showPage,
    showSuccess,
    checkFormData
};

function expressValidator() {
    var notEmpty = Translator().get('verify.error.mustNotBeEmpty');
    
    var validateInputData = [
        check('username', notEmpty)
            .isLength({ min: 1})
            .trim()
            .withMessage(notEmpty),

        check('password')
            .isLength({ min: 1})
            .trim().withMessage(notEmpty),
    ];

    return validateInputData;
}


function showPage (req, res) {
    
    var lineID = req.params.line_id;
    var token = req.params.token;

    var users = UserModel().retrieveByLineId(lineID);
    var self = this;
    users
        .then(function(data) {
            if (data) {
                logger.warn("The line ID:", lineID, "is already verified");
                var dataForRenderingError = {
                    message: self.translator.get('verify.errorMessageLineIdExists'),
                    backButtonText: self.translator.get('verify.button.back')
                }
                return res.render('verify-error', RenderPage().errorForm(dataForRenderingError));
            }

            var retrievedAccessPass = AccessPassModel().retrieve(lineID, token);
            retrievedAccessPass
                .then(function(retrievedAccessPassData) {
                    if (retrievedAccessPassData == null) {
                        return res.render('unauthorized-access', {
                            message: self.translator.get('verify.error.unauthorizedAccess')
                        })
                    }
                    logger.info("verify page has loaded...");   
                    var dataForRendering = {
                        lineID: lineID,
                        token: token,
                        csrfToken: req.csrfToken(),
                        verified: false
                    };
                    res.render('verify', RenderPage().fetchData.call(self, dataForRendering));  
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
}

function showSuccess (req, res) {
    var self = this;
    res.render('success', RenderPage().successForm.call(self));
}

function checkFormData(req, res) {

    var lineID = req.params.line_id;
    var token = req.params.token;
    
    var retrivedAccessPass = AccessPassModel().retrieve(lineID, token);
    logger.info('checking form data...');
    var self = this;
    retrivedAccessPass
        .then(function(retrivedAccessPassData) {
            if (retrivedAccessPassData == null) {
                return res.render('unauthorized-access', {
                    message: "Error : 403 - Unauthorized Access",
                })
            }
            const errors = validationResult(req);
            // matchedData returns only the subset of data validated by the middleware
            const validatedUserData = matchedData(req);
            if (!errors.isEmpty()) {  
                logger.warn('Field must not be empty'); 
                var dataForRendering = {
                    title: self.translator.get('verify.pageTitle.title'),
                    lineID: lineID,
                    token: token,
                    csrfToken: req.body._csrf,
                    username: validatedUserData.username,
                    verified: true,
                    error: errors.array({
                        onlyFirstError: true
                    })
                };
                return res.render('verify', RenderPage().fetchData.call(self, dataForRendering));  
            }

            Verification().checkValidatedUserData.call(self, req, res, lineID, validatedUserData, token);   
        })
        .catch(function(error) {
            logger.error(error.message);
            logger.error(errorLocator());             
        })
}

module.exports = VerifyPageController;