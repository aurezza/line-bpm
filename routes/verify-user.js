var retrieveUsers = require('./retrieve-users'); 
var saveUser = require('./save-user');
var localeChecker = require('./locale/locale-checker');

var employeeDetails = {};

function verifyUser(router, passport, logger){
    // check if line id exists in db
    router.post('/verifyUser/:lineID', function(req, res){
        var lineID = req.params.lineID;
        // vars for checking with k server
        var username = req.body.username;
        var password = req.body.password;

        var users = retrieveUsers(lineID);

        // locale checker
        var localeText= localeChecker('jp','verify-content');

        users.then(function(users){
            if (users){
                logger.info("You're already verified");
                // add error handler on form
                res.send(localeText.errorMessageLineIdExists); 
                // res.redirect('/verify/'+ lineID); 
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
                            return res.status(400).send(err);                           
                        }
                        employeeDetails = {
                            lineID: lineID,
                            name: user.name,
                            employee_id: user.employee_id,
                            email: user.email
                        };

                        saveUser(employeeDetails, logger);
                        return res.json(user);                       
                    });
                    
                })(req,res);
            }
        })
        .catch(function(err){
            // logger.error(err);
        });
    });
}

module.exports = verifyUser;