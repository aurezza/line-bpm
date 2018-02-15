var retrieveUsers = require('../retrieve-users');
var retrieveAccessPass = require('../retrieve-access-pass');
var updateAccessPass = require('../update-access-pass');
var localeChecker = require('../locale/locale-checker');
var logger = require('../../logger');
function verify(router, lineBotId) {


    router.get('/verify/:token/:line_id', function(req, res) {
        var localeText= localeChecker('jp','verify-content');
        var lineID = req.params.line_id;
        var token = req.params.token;
        var accessPass = retrieveAccessPass(lineID,token);
        
        accessPass
        .then(function(accessPass){
            console.log("accessPass is this object",accessPass);
            if (accessPass == null){
                return res.render('unauthorized-access', {
                    message: localeText.errorMessageLineIdExists,
                    backButtonText: localeText.button.back,
                    lineBotId: lineBotId
                })
            }
            
            logger.info("verify page has loaded...");            
            var users = retrieveUsers(lineID, 'empty');
            users.then(function(users){
                if (users){
                    logger.warn("The line ID:", lineID, "is already verified");
                    return res.render('verify-error', {
                        message: localeText.errorMessageLineIdExists,
                        backButtonText: localeText.button.back,
                        lineBotId: lineBotId
                    })
                }
                res.header("ksurf-token","commanotkama");
                res.render('verify', {
                    title: localeText.pageTitle.title,
                    panelTitle: localeText.label.panelTitle,
                    verifyButtonText: localeText.button.verify,
                    usernamePlaceholder: localeText.placeHolder.username, 
                    passwordPlaceholder: localeText.placeHolder.password,
                    lineID: lineID,
                    token: token,
                    verified: false,
                    errors: {},
                    customError: ''   
                });          
    
            })
            .catch(function(err){
                logger.error(err);;
            }); 


        })
        .catch(function(err){
            logger.error(err);;
        }); 


       
   });
}

module.exports = verify;