'use strict';
var accessPassModel = require('../models/access-pass-model');
var logger = require('../logger');

var AccessPass = (function () {
    function AccessPass(accessPassData) {
        //constructor
        this.access_pass_token = accessPassData.access_pass_token || null ;
        this.line_id = accessPassData.access_pass_token || null ;
        this.status = accessPassData.access_pass_token || null ;
    }
    
    AccessPass.prototype.save = function (token, lineId) {

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
    
    return AccessPass;
}());
module.exports = AccessPass;