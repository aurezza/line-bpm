'use strict';

const { validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');
var logger = require('../logger');
var Users = require('../service/users');
var localeChecker = require('../routes/locale/locale-checker');
var checkValidatedUserData = require('../routes/verify/check-validated-user-data');
var localeChecker = require('../routes/locale/locale-checker');
var errorLocator = require('../routes/node/error-locator');
var AccessPass = require('../service/access-pass');
var accessPass = new AccessPass();


var lineBotId = process.env.LINE_BOT_CHANNEL_ID;
var localeText = localeChecker('jp', 'verify-content');
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
                return res.render('verify-error', {
                    message: localeText.errorMessageLineIdExists,
                    backButtonText: localeText.button.back,
                    lineBotId: lineBotId
                })
            }
            res.render('verify', {
                title: localeText.pageTitle.title,
                panelTitle: localeText.label.panelTitle,
                verifyButtonText: localeText.button.verify,
                usernamePlaceholder: localeText.placeHolder.username, 
                passwordPlaceholder: localeText.placeHolder.password,
                lineID: lineID,
                verified: false,
                errors: {},
                customError: ''   
            });

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
    // })
    // .catch(function(error) {
    //     logger.error(error.message);
    //     logger.error(errorLocator());             
    // })

}

module.exports = Verify;