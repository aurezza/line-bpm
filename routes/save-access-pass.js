'use strict';
var accessPassModel = require('../models/access-pass-model');
var logger = require('../logger.js');
function c(token, lineId) {
    // create instance of model transactionModel
    var newAccessPass = new accessPassModel();

    newAccessPass.access_pass_token = token;
    newAccessPass.line_id = lineId;
    newAccessPass.status = "active";
    newAccessPass.save()
        .then(function(savedObject) {
            logger.info('access pass saved');
        })
        .catch(function(error) {
            logger.error(error.message);
            logger.error(error.stack); 
        });    
}
module.exports = saveAccessPass;