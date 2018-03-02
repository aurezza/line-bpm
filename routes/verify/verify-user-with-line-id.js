'use strict';
var retrieveUserByEmployeeId = require('../retrieve-user-by-emp-id');
var saveUser = require('../save-user');
var localeChecker = require('../locale/locale-checker');
var logger = require('../../logger');
var successVerifyLineMessage = require('./success-verify-line-message');
var updateAccessPass = require('../update-access-pass');
var errorLocator = require('../node/error-locator');
var Users = require('../../users/users');

function verifyUserWithLineId(employeeDetails, res, client, lineID, lineBotId) {
    var localeText = localeChecker('jp', 'verify-content');
    var userWithLineId = retrieveUserByEmployeeId(employeeDetails.employee_id);

    userWithLineId.then(function(userWithLineId) {
        if (!userWithLineId) {
            var user = new Users();
            user.save(employeeDetails);
            saveUser(employeeDetails, logger);
            successVerifyLineMessage(client, lineID);
            updateAccessPass(lineID);
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
            logger.error(errorLocator());        
        });                        
}

module.exports = verifyUserWithLineId;