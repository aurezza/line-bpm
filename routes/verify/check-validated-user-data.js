'use strict'; 
var verifyUserWithLineId = require('./verify-user-with-line-id');
var localeChecker = require('../../locale/locale-checker');
var passport = require('passport');
var logger = require('../../logger');
var errorLocator = require('../../node/error-locator');
var employeeDetails = {};
var UserModel = require('../../model/UserModel');

function checkValidatedUserData(req, res, client, lineID, validatedUserData, lineBotId, token) {
    // check if user is in local db
    var userModel = new UserModel({line_id: lineID});
    var users = userModel.retrieveByLineId(lineID); 
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

module.exports = checkValidatedUserData;  