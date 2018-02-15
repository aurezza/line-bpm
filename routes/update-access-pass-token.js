'use strict';
var accessPassModel = require('../models/access-pass-model');
var logger = require('../logger');

function updateAccessPassToken(lineId,token) {
    accessPassModel.updateMany({ owner: lineId }, 
        { $set: {access_pass_token : token }},

        function(){
            logger.info("Access pass with the :"+lineId+" owner was changed");
        });
}

module.exports = updateAccessPassToken;