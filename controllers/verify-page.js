'use strict';

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
var passport = require('passport');
var logger = require('../logger');
var errorLocator = require('../routes/node/error-locator');

var Users = require('../service/users');

var AccessPass = require('../service/access-pass');
var accessPass = new AccessPass();

var RenderPage = require('../service/render-pages');
var renderPage = new RenderPage();

var localeChecker = require('../routes/locale/locale-checker');

var lineBotId = process.env.LINE_BOT_CHANNEL_ID;


const line = require('@line/bot-sdk');
const config = {
    channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
    channelSecret: process.env.LINE_BOT_CHANNEL_SECRET,
};
const client = new line.Client(config);

function Verify(verifyData = {}) {
    
}

Verify.prototype = {
    showVerifyPage: showVerifyPage,
    showVerifySuccess: showVerifySuccess,
    checkVerifyFormData: checkVerifyFormData
};

function showVerifyPage (req, res) {
    var localeText = localeChecker('jp', 'verify-content');
    var lineID = req.params.line_id;
    var token = req.params.token;
    var user = new Users();
    var accessPass = new AccessPass();

    var users = user.retrieveByLineId(lineID);
    users
        .then(function(data) {
            if (data) {
                logger.warn("The line ID:", lineID, "is already verified");
                renderPage.errorForm.message = localeText.errorMessageLineIdExists;
                renderPage.errorForm.backButtonText = localeText.button.back;
                return res.render('verify-error', renderPage.errorForm());
            }

            var retrievedAccessPass = accessPass.retrieve(lineID, token);
            retrievedAccessPass
                .then(function(retrievedAccessPassData) {
                    if (retrievedAccessPassData == null) {
                        return res.render('unauthorized-access', {
                            message: localeText.error.unauthorizedAccess,
                        })
                    }
                    logger.info("verify page has loaded...");   
                    renderPage.lineID = lineID;
                    renderPage.token = token;
                    renderPage.csrfToken = req.csrfToken();
                    renderPage.verified =  false,
                    res.render('verify', renderPage);  
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
    var renderPage = new RenderPage();
    res.render('success', renderPage.successForm());
}

function checkVerifyFormData(req, res) {
    var localeText = localeChecker('jp', 'verify-content');
    var lineID = req.params.lineID;
    var token = req.params.token;
    var retrivedAccessPass = accessPass.retrieve(lineID, token);
    var renderPage = new RenderPage();
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
                renderPage.title = localeText.pageTitle.title;
                renderPage.lineID = lineID;
                renderPage.token = token;
                renderPage.csrfToken = req.body._csrf;
                renderPage.username = validatedUserData.username;
                renderPage.verified = true;
                renderPage.error = errors.array({
                    onlyFirstError: true
                });
                return res.render('verify', renderPage);  
            }

            checkValidatedUserData(req, res, client, lineID, validatedUserData, lineBotId, token);   
        })
        .catch(function(error) {
            logger.error(error.message);
            logger.error(errorLocator());             
        })
}

function checkValidatedUserData(req, res, client, lineID, validatedUserData, lineBotId, token) {
    // check if user is in local db
    var renderPage = new RenderPage();
    var employeeDetails = {};
    var user = new Users({line_id: lineID});
    var users = user.retrieveByLineId(lineID); 
    var localeText = localeChecker('jp', 'verify-content');

    if (!validatedUserData) return logger.error("User data not validated");
    users.then(function(users) {
        if (users) {
            logger.info("The line ID:", lineID, "is already verified");
            renderPage.title = localeText.pageTitle.title,
            renderPage.lineID = lineID,
            renderPage.verified = true,
            renderPage.errors = 'localDbError';
            renderPage.customError = localeText.error.lineIdAlreadyExists;
            return res.render('verify', renderPage);
        }
        
        passport.authenticate('tmj', function(err, user, info) {
            var throwErr = err || info;         
            if (throwErr) {
                logger.error(throwErr.message);
                renderPage.title = localeText.pageTitle.title,
                renderPage.lineID = lineID,
                renderPage.verified = true,
                renderPage.errors = 'bpmsDbError';
                renderPage.customError = localeText.error.wrongCredentials;
                renderPage.csrfToken = req.body._csrf;
                renderPage.token = token;
                res.status(400);
                return res.render('verify', renderPage);               
            }
            req.logIn(user, function(err) {
                if (err) {
                    logger.error("Error 404: ", err.message);
                    renderPage.message = err.message;
                    renderPage.csrfToken = req.body._csrf;
                    return res.status(400).render('verify-error', renderPage.errorForm());                   
                }
                
                employeeDetails = {
                    lineID: lineID,
                    name: user.name,
                    employee_id: user.employee_id,
                    email: user.email
                };

                verifyUserWithLineId(employeeDetails, res, client, lineID, lineBotId);
            });
        })(req, res);               
    })
        .catch(function(error) {
            logger.error(error.message);
            logger.error(errorLocator());
        });     
}

function verifyUserWithLineId(employeeDetails, res, client, lineID) {
    var localeText = localeChecker('jp', 'verify-content');
    var renderPage = new RenderPage();
    var user = new Users(employeeDetails);
    var accessPass = new AccessPass();
    var userWithLineId = user.retrieveByEmpId(employeeDetails.employee_id);
    
    userWithLineId.then(function(data) {
        if (!data) {
            user.save(employeeDetails);
            successVerifyLineMessage(client, lineID);
            accessPass.expireAccessPass(lineID);
            return res.redirect('/success');
        }

        logger.info("This user:", employeeDetails.employee_id, "is already verified");
        renderPage.title = localeText.pageTitle.title;
        renderPage.lineID = lineID;
        renderPage.verified = true;
        renderPage.errors = 'localDbError';
        renderPage.customError = localeText.error.employeeIdAlreadyExists;
        return res.render('verify', renderPage);    

    })
        .catch(function(error) {
            logger.error(error.message);     
        });                        
}

function successVerifyLineMessage(client, lineID)
{
    var localeText = localeChecker('jp', 'success-message');
    logger.info(lineID + " has been successfully verified");
    var msgContent = localeText.successTextMessage;

    const message = {
        type: 'text',
        text: msgContent,
    };
    
    client.pushMessage(lineID, message)
        .then(() => {
            logger.info("message sent to " + lineID);    
        })
        .catch((error) => {
            logger.error(error.message);
            logger.error(errorLocator());  
        });             
  
}

module.exports = Verify;