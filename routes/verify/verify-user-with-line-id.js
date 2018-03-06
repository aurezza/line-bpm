'use strict';
var localeChecker = require('../locale/locale-checker');
var logger = require('../../logger');
var successVerifyLineMessage = require('./success-verify-line-message');
var Users = require('../../service/users');
var AccessPass = require('../../service/access-pass');
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

module.exports = verifyUserWithLineId;