var retrieveUserByEmployeeId = require('../retrieve-user-by-emp-id');
var saveUser = require('../save-user');
var localeChecker = require('../locale/locale-checker');
var logger = require('../../logger');
var success = require('./success');
var successVerifyLineMessage = require('./success-verify-line-message');


function verifyUserWithLineId(employeeDetails, res, client, lineID, lineBotId) {
    var localeText= localeChecker('jp','verify-content');
    var userWithLineId = retrieveUserByEmployeeId(employeeDetails.employee_id);

    userWithLineId.then(function(userWithLineId) {
        if(!userWithLineId) {
            saveUser(employeeDetails, logger);
            successVerifyLineMessage(client, lineID);
            return res.redirect('/success');
        }
        logger.info("This user:", employeeDetails.employee_id, "is already verified");
        res.render('verify-error', {
            message: localeText.error.employeeIdAlreadyExists,
            backButtonText: localeText.button.back,
            lineBotId: lineBotId
        });

    })
    .catch(function(err) {
        logger.error('error', err);
    });                        
}

module.exports = verifyUserWithLineId;