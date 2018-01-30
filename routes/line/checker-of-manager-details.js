var axios = require('axios');
var querystring = require('querystring');
var replyToQuestetra = require('./reply-to-questetra');

function checkManagerDetails(managerData, instanceId){
    if (!Object.keys(managerData).length){
        var axiosParameters = {
            url: process.env.REPLYURL_TO_QUESTETRA_REQUEST_STATUS,
            content:{
                processInstanceId:instanceId,
                key:process.env.KEY_TO_QUESTETRA_REQUEST_STATUS,
                //q_sendingstatus from questetra also be used as query params
                q_sendingstatus:'no manager detail'
            }
        };
        replyToQuestetra(querystring, axios, 'emptyPostBack', axiosParameters);
        return false;
    } 
    return true;
}
module.exports = checkManagerDetails;