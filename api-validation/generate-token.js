var jwt = require('jsonwebtoken');
var logger = require('../logger');
var retrieveByApiKey = require('./retrieve-by-api-key');

// TODO: create proper UI for generating keys
function generateToken(router, generatedSecretKey) {
    router.get('/api/generate-token', function(req, res) {
        // TODO: add success verification here
        var successVerification = true;

        // TODO: get from db the api values for payload
        const payload = {
            api_name: 'line'
            // insert other defined values here
        };

        var token = jwt.sign(payload, generatedSecretKey, {
            expiresIn: "2 days"
        });

        // return the token information 
        if(successVerification){
            res.json({
                success: true,
                message: 'You haz token now',
                token: token
            });
        }
    });
}

module.exports = generateToken;