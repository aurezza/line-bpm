'use strict';
var accessPassModel = require('../models/access-pass-model');
var logger = require('../logger');

function updateAccessPass(lineId) {


    accessPassModel.update({ owner: lineId }, 
        { $set: {status : "expired"}},

        function(){
            logger.info("all access pass with the :"+lineId+" owner was updated to expired");
        });

        
    
}

module.exports = updateAccessPass;