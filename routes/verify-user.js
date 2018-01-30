var retrieveUsers = require('./retrieve-users'); 
var localeChecker = require('./locale/localechecker');

function verifyUser(router, passport, lineID){
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
                // logger.info("You're already verified");
                // add error handler on form
                res.send(localeText.errorMessageLineIdExists); 
                // res.redirect('/verify/'+ lineID); 
            }
            else {
                passport.authenticate('tmj',
                function(err, user, info) {
                    console.log('authenticate start');
                    console.log('user',  user);
                    var throwErr = err || info;         
                    if (throwErr) {
                        console.log('status 400', throwErr);
                        return res.status(400).send(throwErr);        
                    }
            
                    req.logIn(user, function(err) {
                        if (err) {
                            return res.status(400).send(err);                           
                        }
                        return res.json(user);                       
                    });
                    
                })(req,res);
            }
        })
        .catch(function(err){
            // logger.erro(err);
        });
    });
}

module.exports = verifyUser;