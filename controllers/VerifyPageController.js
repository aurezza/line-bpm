'use strict';

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
var passport = require('passport');
var logger = require('../logger');
var errorLocator = require('../routes/node/error-locator');
var localeChecker = require('../routes/locale/locale-checker');

var Users = require('../service/users');
var AccessPass = require('../service/access-pass');
var RenderPage = require('../service/render-pages');
var LineConfiguration = require('../config/line');

var line = require('@line/bot-sdk');
// var client = new line.Client(LineConfiguration().lineConfiguration());

function VerifyPageController() {
    if (!(this instanceof VerifyPageController)) return new VerifyPageController();
}

VerifyPageController.prototype = {
    showPage: showVerifyPage,
    showSuccess: showVerifySuccess,
    checkFormData: checkVerifyFormData 
};

function showVerifyPage (req, res) {
    var localeText = localeChecker('jp', 'verify-content');
    var lineID = req.params.line_id;
    var token = req.params.token;

    var users = Users().retrieveByLineId(lineID);
    users
        .then(function(data) {
            if (data) {
                logger.warn("The line ID:", lineID, "is already verified");
                // RenderPage().errorForm.message = localeText.errorMessageLineIdExists;
                // RenderPage().errorForm.backButtonText = localeText.button.back;
                var dataForRenderingError = {
                    message: localeText.errorMessageLineIdExists,
                    backButtonText: localeText.button.back
                }
                return res.render('verify-error', RenderPage().errorForm(dataForRenderingError));
            }

            var retrievedAccessPass = AccessPass().retrieve(lineID, token);
            retrievedAccessPass
                .then(function(retrievedAccessPassData) {
                    if (retrievedAccessPassData == null) {
                        return res.render('unauthorized-access', {
                            message: localeText.error.unauthorizedAccess,
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

function showVerifySuccess (req, res) {
    // var client = new line.Client(LineConfiguration().lineConfiguration([0]));
    const config = {
        channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
        channelSecret: process.env.LINE_BOT_CHANNEL_SECRET,
    };
    const client = new line.Client(config);
    logger.info('lineconfig: ', LineConfiguration().lineConfiguration([0]));
    logger.info('client', client);
    res.render('success', RenderPage().successForm());
}

function checkVerifyFormData(req, res) {
    var localeText = localeChecker('jp', 'verify-content');
    var lineID = req.params.lineID;
    var token = req.params.token;

    var retrivedAccessPass = AccessPass().retrieve(lineID, token);
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
                    title: localeText.pageTitle.title,
                    lineID: lineID,
                    token: token,
                    csrfToken: req.body._csrf,
                    verified: true,
                    error: errors.array({
                        onlyFirstError: true
                    })
                };
                res.render('verify', RenderPage().fetchData(dataForRendering));  
            }

            checkValidatedUserData(req, res, lineID, validatedUserData, LineConfiguration().lineBotId, token);   
        })
        .catch(function(error) {
            logger.error(error.message);
            logger.error(errorLocator());             
        })
}

function checkValidatedUserData(req, res, lineID, validatedUserData, lineBotId, token) {
    // check if user is in local db
    var employeeDetails = {};
    var localeText = localeChecker('jp', 'verify-content');
    var users = Users({line_id: lineID}).retrieveByLineId(lineID); 

    if (!validatedUserData) return logger.error("User data not validated");
    users.then(function(data) {
        if (data) {
            logger.info("The line ID:", lineID, "is already verified");
            var dataForRendering = {
                title: localeText.pageTitle.title,
                lineID: lineID,
                verified: true,
                errors: 'localDbError',
                customError: localeText.error.lineIdAlreadyExists
            };
            res.render('verify', RenderPage().fetchData(dataForRendering));  
        }
        
        passport.authenticate('tmj', function(err, user, info) {
            var throwErr = err || info;         
            if (throwErr) {
                logger.error(throwErr.message);
                var dataForRenderingForPassport = {
                    title: localeText.pageTitle.title,
                    lineID: lineID,
                    token: token,
                    csrfToken: req.body._csrf,
                    verified: true,
                    errors: 'bpmsDbError',
                    customError: localeText.error.wrongCredentials
                };
                res.status(400); 
                res.render('verify', RenderPage().fetchData(dataForRenderingForPassport));               
            }
            req.logIn(user, function(err) {
                if (err) {
                    logger.error("Error 404: ", err.message);
                    // RenderPage().message = err.message;
                    // RenderPage().csrfToken = req.body._csrf;
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
    var localeText = localeChecker('jp', 'verify-content');
    var userWithLineId = Users(employeeDetails).retrieveByEmpId(employeeDetails.employee_id);
    
    userWithLineId.then(function(data) {
        if (!data) {
            Users().save(employeeDetails);
            successVerifyLineMessage(lineID);
            AccessPass().expireAccessPass(lineID);
            return res.redirect('/success');
        }

        logger.info("This user:", employeeDetails.employee_id, "is already verified"); 
        var dataForRendering = {
            title: localeText.pageTitle.title,
            lineID: lineID,
            verified: true,
            errors: 'localDbError',
            customError: localeText.error.employeeIdAlreadyExists
        };
         
        res.render('verify', RenderPage().fetchData(dataForRendering));  

    })
        .catch(function(error) {
            logger.error(error.message);     
        });                        
}

function successVerifyLineMessage(lineID)
{
    var localeText = localeChecker('jp', 'success-message');
    logger.info(lineID + " has been successfully verified");
    var msgContent = localeText.successTextMessage;

    const message = {
        type: 'text',
        text: msgContent,
    };

    // var client = new line.Client(LineConfiguration().lineConfiguration([0]));
    
    LineConfiguration().lineConfiguration([0]).pushMessage(lineID, message)
        .then(() => {
            logger.info("message sent to " + lineID);    
        })
        .catch((error) => {
            logger.error(error.message);
            logger.error(errorLocator());  
        });             
  
}

module.exports = VerifyPageController;