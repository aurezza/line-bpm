'use strict';

var passport = require('passport');

var logger = require('../logger');
var errorLocator = require('../node/error-locator');

var UserModel = require('../model/UserModel');
var AccessPassModel = require('../model/AccessPassModel');
var RenderPage = require('../service/RenderPages');
var LineConfiguration = require('../config/line');
var LineService = require('../service/Line');

var line = require('@line/bot-sdk');

function Verification() {
    if (!(this instanceof Verification)) return new Verification();
}

Verification.prototype = {
    checkValidatedUserData,
    verifyUserWithLineId,
    successVerifyLineMessage
};

function checkValidatedUserData(req, res, lineID, validatedUserData, lineBotId, token) {
    // check if user is in local db
    var employeeDetails = {};
    var users = UserModel().retrieveByLineId(lineID); 
    logger.info('checking validated user data...');
    if (!validatedUserData) return logger.error("User data not validated");

    var self = this;
    users.then(function(data) {
        if (data) {
            logger.info("The line ID:", lineID, "is already verified");
            var dataForRendering = {
                title: self.translator.get('verify.pageTitle.title'),
                lineID: lineID,
                verified: true,
                errors: 'localDbError',
                customError: self.translator.get('verify.error.lineIdAlreadyExists')
            };
            return res.render('verify', RenderPage().fetchData.call(self, dataForRendering));  
        }
        
        passport.authenticate('tmj', function(err, user, info) {
            var throwErr = err || info;         
            if (throwErr) {
                logger.error(throwErr.message);
                var dataForRenderingForPassport = {
                    title: self.translator.get('verify.title'),
                    lineID: lineID,
                    token: token,
                    csrfToken: req.body._csrf,
                    verified: true,
                    errors: 'bpmsDbError',
                    customError: self.translator.get('verify.error.wrongCredentials')
                };
                res.status(400); 
                return res.render('verify', RenderPage().fetchData.call(self, dataForRenderingForPassport));               
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

                verifyUserWithLineId.call(self, employeeDetails, res, lineID);
            });
        })(req, res);               
    })
        .catch(function(error) {
            logger.error(error.message);
            logger.error(errorLocator());
        });     
}

function verifyUserWithLineId(employeeDetails, res, lineID) {
    var userWithLineId = UserModel().retrieveByEmpId(employeeDetails.employee_id);
    logger.info('verifying user line ID...');
    var self = this;
    userWithLineId.then(function(data) {
        if (!data) {
            UserModel().save(employeeDetails);
            successVerifyLineMessage.call(self, lineID);
            AccessPassModel().expireAccessPass(lineID);
            return res.redirect('/success');
        }

        logger.info("This user:", employeeDetails.employee_id, "is already verified"); 
        var dataForRendering = {
            title: self.translator.get('verify.title'),
            lineID: lineID,
            verified: true,
            errors: 'localDbError',
            customError: self.translator.get('verify.error.employeeIdAlreadyExists')
        };
         
        return res.render('verify', RenderPage().fetchData.call(self, dataForRendering));  

    })
        .catch(function(error) {
            logger.error(error.message);     
        });                        
}

function successVerifyLineMessage(lineID)
{
    logger.info(lineID + " has been successfully verified");
    var self = this;
    const message = {
        type: 'text',
        text: self.translator.get('verify.successTextMessage'),
    };

    var client = new line.Client(LineConfiguration.api);    
    LineService().clientPushMessage(client, lineID, message, false);
    
}
