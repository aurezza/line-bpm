'use strict';

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
// var passport = require('passport');
var logger = require('../logger');
var errorLocator = require('../node/error-locator');
var Translator = require('../service/Translator');
var RenderPage = require('../service/RenderPages');
var Verification = require('../service/Verification');
var UserModel = require('../model/UserModel');
var AccessPassModel = require('../model/AccessPassModel');

var LineConfiguration = require('../config/line');
// var LineService = require('../service/Line');

// var line = require('@line/bot-sdk');

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

            Verification().checkValidatedUserData.call(self, req, res, lineID, validatedUserData, LineConfiguration.lineBotId, token);   
        })
        .catch(function(error) {
            logger.error(error.message);
            logger.error(errorLocator());             
        })
}

// function checkValidatedUserData(req, res, lineID, validatedUserData, lineBotId, token) {
//     // check if user is in local db
//     var employeeDetails = {};
//     var users = UserModel().retrieveByLineId(lineID); 
//     logger.info('checking validated user data...');
//     if (!validatedUserData) return logger.error("User data not validated");

//     var self = this;
//     users.then(function(data) {
//         if (data) {
//             logger.info("The line ID:", lineID, "is already verified");
//             var dataForRendering = {
//                 title: self.translator.get('verify.pageTitle.title'),
//                 lineID: lineID,
//                 verified: true,
//                 errors: 'localDbError',
//                 customError: self.translator.get('verify.error.lineIdAlreadyExists')
//             };
//             return res.render('verify', RenderPage().fetchData.call(self, dataForRendering));  
//         }
        
//         passport.authenticate('tmj', function(err, user, info) {
//             var throwErr = err || info;         
//             if (throwErr) {
//                 logger.error(throwErr.message);
//                 var dataForRenderingForPassport = {
//                     title: self.translator.get('verify.title'),
//                     lineID: lineID,
//                     token: token,
//                     csrfToken: req.body._csrf,
//                     verified: true,
//                     errors: 'bpmsDbError',
//                     customError: self.translator.get('verify.error.wrongCredentials')
//                 };
//                 res.status(400); 
//                 return res.render('verify', RenderPage().fetchData.call(self, dataForRenderingForPassport));               
//             }
//             req.logIn(user, function(err) {
//                 if (err) {
//                     logger.error("Error 404: ", err.message);
//                     var dataForRenderingError = {
//                         message: err.message,
//                         csrfToken: req.body._csrf
//                     };
//                     return res.status(400).render('verify-error', RenderPage().errorForm(dataForRenderingError));                   
//                 }
                
//                 employeeDetails = {
//                     lineID: lineID,
//                     name: user.name,
//                     employee_id: user.employee_id,
//                     email: user.email
//                 };

//                 verifyUserWithLineId.call(self, employeeDetails, res, lineID);
//             });
//         })(req, res);               
//     })
//         .catch(function(error) {
//             logger.error(error.message);
//             logger.error(errorLocator());
//         });     
// }

// function verifyUserWithLineId(employeeDetails, res, lineID) {
//     var userWithLineId = UserModel().retrieveByEmpId(employeeDetails.employee_id);
//     logger.info('verifying user line ID...');
//     var self = this;
//     userWithLineId.then(function(data) {
//         if (!data) {
//             UserModel().save(employeeDetails);
//             successVerifyLineMessage.call(self, lineID);
//             AccessPassModel().expireAccessPass(lineID);
//             return res.redirect('/success');
//         }

//         logger.info("This user:", employeeDetails.employee_id, "is already verified"); 
//         var dataForRendering = {
//             title: self.translator.get('verify.title'),
//             lineID: lineID,
//             verified: true,
//             errors: 'localDbError',
//             customError: self.translator.get('verify.error.employeeIdAlreadyExists')
//         };
         
//         return res.render('verify', RenderPage().fetchData.call(self, dataForRendering));  

//     })
//         .catch(function(error) {
//             logger.error(error.message);     
//         });                        
// }

// function successVerifyLineMessage(lineID)
// {
//     logger.info(lineID + " has been successfully verified");
//     var self = this;
//     const message = {
//         type: 'text',
//         text: self.translator.get('verify.successTextMessage'),
//     };

//     var client = new line.Client(LineConfiguration.api);    
//     LineService().clientPushMessage(client, lineID, message, false);
    
// }


module.exports = VerifyPageController;