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
// var localeText = localeChecker('jp', 'verify-content');

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
    var user = new Users();
    var lineID = req.params.line_id;
    var localeText = localeChecker('jp', 'verify-content');
    logger.info("verify page has loaded...");

    var users = user.retrieveByLineId(lineID);
    users
        .then(function(data) {
            if (data) {
                logger.warn("The line ID:", lineID, "is already verified");
                return res.render('verify-error', renderPage.errorForm(lineBotId));
                // return res.render('verify-error', {
                //     message: localeText.errorMessageLineIdExists,
                //     backButtonText: localeText.button.back,
                //     lineBotId: lineBotId
                // })
            }
            res.render('verify', renderPage.verifyForm(lineID));
            // res.render('verify', {
            //     title: localeText.pageTitle.title,
            //     panelTitle: localeText.label.panelTitle,
            //     verifyButtonText: localeText.button.verify,
            //     usernamePlaceholder: localeText.placeHolder.username, 
            //     passwordPlaceholder: localeText.placeHolder.password,
            //     lineID: lineID,
            //     verified: false,
            //     errors: {},
            //     customError: ''   
            // });

        })
        .catch(function(err) {
            logger.error(err);;
        }); 
}

function showVerifySuccess (req, res) {
    var localeText = localeChecker('jp', 'success-message');
    res.render('success', {
        title: localeText.successTextTitle, 
        description: localeText.successTextMessage,
        successButtonText: localeText.closeWindow,
        lineBotId: lineBotId
    });
}

function checkVerifyFormData(req, res) {
    var lineID = req.params.lineID;
    var token = req.params.token;
    var retrivedAccessPass = accessPass.retrieve(lineID, token);
    var verifyFunc = new Verify();
    // retrivedAccessPass
    //     .then(function(retrivedAccessPass) {
    //         if (retrivedAccessPass == null) {
    //             return res.render('unauthorized-access', {
    //                 message: "Error : 403 - Unauthorized Access",
    //             })
    //         }
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
}

function checkValidatedUserData(req, res, client, lineID, validatedUserData, lineBotId, token) {
    // check if user is in local db
    var employeeDetails = {};
    var user = new Users({line_id: lineID});
    var users = user.retrieveByLineId(lineID); 
    var localeText = localeChecker('jp', 'verify-content');

    if (!validatedUserData) return logger.error("User data not validated");
    users.then(function(users) {
        if (users) {
            logger.info("The line ID:", lineID, "is already verified");
            var lineIdAlreadyExists = localeText.error.lineIdAlreadyExists;
            return res.render('verify', {
                title: localeText.pageTitle.title,
                panelTitle: localeText.label.panelTitle,
                verifyButtonText: localeText.button.verify,
                usernamePlaceholder: localeText.placeHolder.username, 
                passwordPlaceholder: localeText.placeHolder.password,
                lineID: lineID,
                verified: true,
                errors: 'localDbError',
                customError: lineIdAlreadyExists
            });
        }
        // authenticate start
        passport.authenticate('tmj', function(err, user, info) {
            var throwErr = err || info; 
            var wrongCredentials = localeText.error.wrongCredentials;        
            if (throwErr) {
                logger.error(throwErr.message);
                res.status(400);
                return res.render('verify', {
                    title: localeText.pageTitle.title,
                    panelTitle: localeText.label.panelTitle,
                    verifyButtonText: localeText.button.verify,
                    usernamePlaceholder: localeText.placeHolder.username, 
                    passwordPlaceholder: localeText.placeHolder.password,
                    lineID: lineID,
                    verified: true,
                    errors: 'bpmsDbError',
                    customError: wrongCredentials,
                    csrfToken: req.body._csrf,
                    token: token
                });                  
            }
            req.logIn(user, function(err) {
                if (err) {
                    logger.error("Error 404: ", err.message);
                    return res.status(400).render('verify-error', {
                        message: err.message,
                        backButtonText: localeText.button.back,
                        lineBotId: lineBotId,
                        csrfToken: req.body._csrf
                    });                      
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
        var employeeIdAlreadyExists = localeText.error.employeeIdAlreadyExists;
        return res.render('verify', {
            title: localeText.pageTitle.title,
            panelTitle: localeText.label.panelTitle,
            verifyButtonText: localeText.button.verify,
            usernamePlaceholder: localeText.placeHolder.username, 
            passwordPlaceholder: localeText.placeHolder.password,
            lineID: lineID,
            verified: true,
            errors: 'localDbError',
            customError: employeeIdAlreadyExists
        });        

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