var retrieveUsers = require('./retrieve-users'); 
var verifyUserWithLineId = require('./verify-user-with-line-id');
var localeChecker = require('./locale/locale-checker');

var employeeDetails = {};

function checkValidatedUserData(passport, req, res, lineID, validatedUserData) {
    // check if user is in local db
    var users = retrieveUsers(lineID, 'empty');

    if (validatedUserData) {
        users.then(function(users){
            if (users){
                logger.info("The line ID:", lineID, "is already verified");
                // add error handler on form
                res.send(localeText.error.lineIdAlreadyExists); 
            }
            else {
                // authenticate start
                passport.authenticate('tmj',
                function(err, user, info) {
                    var throwErr = err || info;         
                    if (throwErr) {
                        return res.status(400).send(throwErr);        
                    }
            
                    req.logIn(user, function(err) {
                        if (err) {
                            // edit message for error; must be generic
                            return res.status(400).send(err.message);                      
                        }
                        employeeDetails = {
                            lineID: lineID,
                            name: user.name,
                            employee_id: user.employee_id,
                            email: user.email
                        };
                        verifyUserWithLineId(employeeDetails, res);
                    });
                    
                })(req,res);
            }
        })
        .catch(function(err){
            logger.error(err);
        });
    }   
}

module.exports = checkValidatedUserData;  