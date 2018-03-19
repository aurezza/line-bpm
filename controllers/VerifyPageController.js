'use strict';

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
var passport = require('passport');
var logger = require('../logger');
var errorLocator = require('../node/error-locator');
var Translator = require('../service/Translator');

var UserModel = require('../model/UserModel');
var AccessPassModel = require('../model/AccessPassModel');
var RenderPage = require('../service/RenderPages');
var LineConfiguration = require('../config/line');

var line = require('@line/bot-sdk');

function VerifyPageController() {
    if (!(this instanceof VerifyPageController)) return new VerifyPageController();
    this.translator = Translator();
}

VerifyPageController.prototype = {
    showPage,
    showSuccess,
    checkFormData
};

<<<<<<< HEAD
function showVerifyPage (req, res) {
=======
function showPage (req, res) {
    var localeText = localeChecker('jp', 'verify-content');
>>>>>>> transferred api service to model; modified verify files
    var lineID = req.params.line_id;
    var token = req.params.token;

    var users = UserModel().retrieveByLineId(lineID);
    users
        .then(function(data) {
            if (data) {
                logger.warn("The line ID:", lineID, "is already verified");
                var dataForRenderingError = {
                    message: this.translator('verify.errorMessageLineIdExists'),
                    backButtonText: this.translator('verify.button.back')
                }
                return res.render('verify-error', RenderPage().errorForm(dataForRenderingError));
            }

            var retrievedAccessPass = AccessPassModel().retrieve(lineID, token);
            retrievedAccessPass
                .then(function(retrievedAccessPassData) {
                    if (retrievedAccessPassData == null) {
                        return res.render('unauthorized-access', {
                            message: this.translator('verify.error.unauthorizedAccess')
                        })
                    }
                    logger.info("verify page has loaded...");   
                    var dataForRendering = {
                        lineID: lineID,
                        token: token,
                        csrfToken: req.csrfToken(),
                        verified: false
                    };
                    res.render('verify', RenderPage().fetchData(dataForRendering));  
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
    res.render('success', RenderPage().successForm());
}

<<<<<<< HEAD
function checkVerifyFormData(req, res) {
=======
function checkFormData(req, res) {
    var localeText = localeChecker('jp', 'verify-content');
>>>>>>> transferred api service to model; modified verify files
    var lineID = req.params.lineID;
    var token = req.params.token;

    var retrivedAccessPass = AccessPassModel().retrieve(lineID, token);
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
                    title: this.translator('verify.pageTitle.title'),
                    lineID: lineID,
                    token: token,
                    csrfToken: req.body._csrf,
                    username: validatedUserData.username,
                    verified: true,
                    error: errors.array({
                        onlyFirstError: true
                    })
                };
                return res.render('verify', RenderPage().fetchData(dataForRendering));  
            }

            checkValidatedUserData(req, res, lineID, validatedUserData, LineConfiguration.lineBotId, token);   
        })
        .catch(function(error) {
            logger.error(error.message);
            logger.error(errorLocator());             
        })
}

function checkValidatedUserData(req, res, lineID, validatedUserData, lineBotId, token) {
    // check if user is in local db
    var employeeDetails = {};
<<<<<<< HEAD
    var users = Users({line_id: lineID}).retrieveByLineId(lineID); 
=======
    var localeText = localeChecker('jp', 'verify-content');
    var users = UserModel({line_id: lineID}).retrieveByLineId(lineID); 
>>>>>>> transferred api service to model; modified verify files

    if (!validatedUserData) return logger.error("User data not validated");
    users.then(function(data) {
        if (data) {
            logger.info("The line ID:", lineID, "is already verified");
            var dataForRendering = {
                title: this.translator('verify.pageTitle.title'),
                lineID: lineID,
                verified: true,
                errors: 'localDbError',
                customError: this.translator('verify.error.lineIdAlreadyExists')
            };
            return res.render('verify', RenderPage().fetchData(dataForRendering));  
        }
        
        passport.authenticate('tmj', function(err, user, info) {
            var throwErr = err || info;         
            if (throwErr) {
                logger.error(throwErr.message);
                var dataForRenderingForPassport = {
                    title: this.translator('verify.title'),
                    lineID: lineID,
                    token: token,
                    csrfToken: req.body._csrf,
                    verified: true,
                    errors: 'bpmsDbError',
                    customError: this.translator('verify.error.wrongCredentials')
                };
                res.status(400); 
                return res.render('verify', RenderPage().fetchData(dataForRenderingForPassport));               
            }
            req.logIn(user, function(err) {
                if (err) {
                    logger.error("Error 404: ", err.message);
                    var dataForRenderingError = {
                        message: err.message,
                        csrfToken: req.body._csrf
                    };
                    return res.status(400).render('verify-error', RenderPage().errorForm(dataForRenderingError));                   
                }
                
                employeeDetails = {
                    lineID: lineID,
                    name: user.name,
                    employee_id: user.employee_id,
                    email: user.email
                };

                verifyUserWithLineId(employeeDetails, res, lineID, lineBotId);
            });
        })(req, res);               
    })
        .catch(function(error) {
            logger.error(error.message);
            logger.error(errorLocator());
        });     
}

function verifyUserWithLineId(employeeDetails, res, lineID) {
<<<<<<< HEAD
    var userWithLineId = Users(employeeDetails).retrieveByEmpId(employeeDetails.employee_id);
=======
    var localeText = localeChecker('jp', 'verify-content');
    var userWithLineId = UserModel(employeeDetails).retrieveByEmpId(employeeDetails.employee_id);
>>>>>>> transferred api service to model; modified verify files
    
    userWithLineId.then(function(data) {
        if (!data) {
            UserModel().save(employeeDetails);
            successVerifyLineMessage(lineID);
            AccessPassModel().expireAccessPass(lineID);
            return res.redirect('/success');
        }

        logger.info("This user:", employeeDetails.employee_id, "is already verified"); 
        var dataForRendering = {
            title: this.translator('verify.title'),
            lineID: lineID,
            verified: true,
            errors: 'localDbError',
            customError: this.translator('verify.error.employeeIdAlreadyExists')
        };
         
        return res.render('verify', RenderPage().fetchData(dataForRendering));  

    })
        .catch(function(error) {
            logger.error(error.message);     
        });                        
}

function successVerifyLineMessage(lineID)
{
    logger.info(lineID + " has been successfully verified");
    const message = {
        type: 'text',
        text: this.translator('verify.successTextMessage'),
    };

    var client = new line.Client(LineConfiguration.api);
    
    client.pushMessage(lineID, message)
        .then(() => {
            logger.info("message sent to " + lineID);    
        })
        .catch((error) => {
            logger.error(error.message);
            logger.error(errorLocator());  
        });             
  
}

module.exports = VerifyPageController;