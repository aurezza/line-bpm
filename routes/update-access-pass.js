'use strict';
var accessPassModel = require('../models/access-pass-model');
var logger = require('../logger');

function updateAccessPass(lineId) {

    console.log("lineId in updateAccessPass",lineId);
    accessPassModel.update({ owner: "U69d42742a42fbb532dd02920351e776e" }, 
        { $set: {status : "expired"}},

        function(){
            logger.info("all access pass with the :"+lineId+" owner was updated to expired");
        });

        
    
}

module.exports = updateAccessPass;