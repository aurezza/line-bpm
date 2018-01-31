var retrieveUsers = require('./retrieve-users'); 
var saveUser = require('./save-user');
var localeChecker = require('./locale/locale-checker'); 
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

var employeeDetails = {};

// locale checker
var localeText= localeChecker('jp','verify-content');
var notEmpty = localeText.error.mustNotBeEmpty;

function verifyUser(router, passport, logger){
    // needs additional validation for schema and dynamic messages for locale
    router.post('/verify/:lineID', [
        check('username', notEmpty)
        .isLength({ min: 1})
        .trim()
        .withMessage(notEmpty),

        check('password')
        .isLength({ min: 1})
        .trim().withMessage(notEmpty),
    ], 
    function(req, res){
        var lineID = req.params.lineID;

        // check if user is in local db
        var users = retrieveUsers(lineID, 'empty');

        const errors = validationResult(req);
        // matchedData returns only the subset of data validated by the middleware
        const validatedUserData = matchedData(req);

        if (!errors.isEmpty()) {
            
            return res.render('verify',{
                title: localeText.pageTitle.title,
                panelTitle: localeText.label.panelTitle,
                verifyButtonText: localeText.button.verify,
                usernamePlaceholder: localeText.placeHolder.username, 
                passwordPlaceholder: localeText.placeHolder.password,
                lineID: lineID,
                username: validatedUserData.username,
                error: errors.array({
                    onlyFirstError: true
                })
            });

        }
        
        if (validatedUserData) {
            users.then(function(users){
                if (users){
                    logger.info("The line ID:", lineID, "is already verified");
                    // add error handler on form
                    res.send(localeText.errorMessageLineIdExists); 
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
    
                            saveUser(employeeDetails, logger);
                            res.redirect('/success');                      
                        });
                        
                    })(req,res);
                }
            })
            .catch(function(err){
                logger.error(err);
            });
        }      
    });
}

module.exports = verifyUser;