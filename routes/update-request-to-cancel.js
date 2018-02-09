'use strict';
var requestModel = require('../models/request-model');
var logger = require('../logger');

function updateRequesttoCancel(params) {
    
    requestModel.update({ process_id: params.process_id }, 
        { $set: {status : "cancelled"}},

        function(){
            logger.info("process_id :"+params.processInstanceId+" was updated to cancel");
        });

        console.log('params',params);
    
}

module.exports = updateRequesttoCancel;