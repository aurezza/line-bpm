'use strict';
var retrieveUsers = require('../retrieve-users'); 
var verifyUserWithLineId = require('./verify-user-with-line-id');
var localeChecker = require('../locale/locale-checker');
var passport = require('passport');
var logger = require('../../logger');
var employeeDetails = {};

function checkValidatedUserData(req, res, client, lineID, validatedUserData, lineBotId) {
    // check if user is in local db
    var users = retrieveUsers(lineID, 'empty');
    var localeText= localeChecker('jp','verify-content');

    if (!validatedUserData) return logger.error("User data not validated");
    users.then(function(users){
        if (users){
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
                    customError: wrongCredentials
                });                  
            }
            req.logIn(user, function(err) {
                if (err) {
                    logger.error("Error 404: ", err.message);
                    return res.status(400).render('verify-error', {
                        message: err.message,
                        backButtonText: localeText.button.back,
                        lineBotId: lineBotId
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
        })(req,res);               
    })
    .catch(function(err){
        logger.error('verify/check-validated-user-data.js');
        logger.error(err);
    });     
}

module.exports = checkValidatedUserData;  