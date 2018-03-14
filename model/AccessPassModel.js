'use strict';
var accessPassSchema = require('../schema/access-pass-schema');
var logger = require('../logger');

function AccessPassModel() {
    //constructor
    if (!(this instanceof AccessPassModel)) return new AccessPassModel();
}

AccessPassModel.prototype = {
    save: save,
    changeAccessPass: changeAccessPass,
    expireAccessPass: expireAccessPass,
    retrieveLineId: retrieveLineId,
    retrieve: retrieve
};

function save (token, lineId) {
    var newAccessPass = new accessPassSchema();
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

function changeAccessPass (lineId, token) {
    accessPassSchema.updateMany({ line_id: lineId }, 
        { $set: {access_pass_token: token }},
    
        function() {
            logger.info("Access pass with the :" + lineId + " owner was changed");
        });
}

function expireAccessPass (lineId) {
    accessPassSchema.updateMany({ 
        line_id: lineId, 
        status: "active" }, 
    { $set: {status: "expired"}},

    function() {
        logger.info("all access pass with the :" + lineId + " owner was updated to expired");
    });
}

function retrieveLineId (lineId) {
    var accessPassOwner = accessPassSchema.findOne({
        line_id: lineId,
        status: "active"
    });		
    accessPassOwner
        .exec(function(res, err) {
            if (err.message) { logger.error(err.message);}
        });
            
    return accessPassOwner;
}

function retrieve (lineId, token) {
    var accessPass = accessPassSchema.findOne({
        line_id: lineId, 
        access_pass_token: token, 
        status: "active"
    });
    accessPass
        .exec(function(res, err) {
            if (err.message) { logger.error(err.message);}
        });
            
    return accessPass;
}


module.exports = AccessPassModel;