'use strict';
var requestModel = require('../models/request-model');
var logger = require('../logger');
var errorLocator = require('../routes/node/error-locator');

var Requests = (function () {
    function Requests(requestData) {
        //constructor
        this.user_name = requestData.user_name || null;
        this.overtime_date = requestData.overtime_date || null;
        this.process_id = requestData.process_id || null;
        this.reason = requestData.reason || null;
        this.status = requestData.status || null;
        this.manager_email = requestData.manager_email || null;
    }

    Requests.prototype.save = function(requestData) {
        var newRequest = new requestModel();

        newRequest.user_name = requestData.user_name;
        newRequest.overtime_date = requestData.overtime_date;
        newRequest.process_id = requestData.process_id;
        newRequest.reason = requestData.reason;
        newRequest.status = requestData.status;
        newRequest.manager_email = requestData.manager_email;
    
        newRequest.save()
            .then(function(savedObject) {
                logger.info('data saved');
            })
            .catch(function(error) {
                logger.error(error.message);
                logger.error(error.stack); 
            }); 
    }

    Requests.prototype.retrieve = function (requestId) {
        var overtimeRequest = requestModel.findOne({process_id: requestId,
            $or: [{status: "approved"}, {status: "declined"}, {status: "cancelled"}]});
        
        overtimeRequest
            .exec(function(res, err) {
                if (err.message) { logger.error(err.message); logger.error(errorLocator());}      
            });	
        return overtimeRequest;
    }

    Requests.prototype.updateToCancel = function (requestData) {
        requestModel.update({ process_id: requestData.process_id }, 
            { $set: {status: "cancelled"}},
    
            function() {
                logger.info("process_id :" + requestData.process_id + " was updated to cancel");
            });
    }

    Requests.prototype.updateToApproveDisapprove = function (requestData) {

        var replymessage = requestData.q_replymessage ;
        var requestStatus = {
            yes: "approved",
            no: "declined"
        };
        requestModel
            .findOneAndUpdate({process_id: requestData.processInstanceId, status: "pending"},
                {status: requestStatus[replymessage]},
                function() {
                    logger.info('updated');
                }
            );
        
    }
    return Requests;
}());

module.exports = Requests;