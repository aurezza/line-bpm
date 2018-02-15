'use strict';
var accessPassModel = require('../models/access-pass-model');
var logger = require('../logger');

function updateAccessPassToken(lineId,token) {
    accessPassModel.updateMany({ owner: lineId }, 
        { $set: {access_pass_token : token }},

        function(){
            logger.info("all access pass with the :"+lineId+" owner was updated to expired");
        });

        
    
}

module.exports = updateAccessPassToken;