var axios = require('axios');
var querystring = require('querystring');
var messageContent = require('../questetra/message-text/message-content');
var fromNode = require('./from-node');
var saveRequest = require('../save-request');
var retrieveRequest = require('../retrieve-request');
function sender(body, managerData, client){
    console.log("body",body);
    var messageText = messageContent(body);
    const message = {
        "type": "template",
        "altText": "this is a confirm template",
        "template": {
            "type": "confirm",
            "text":  messageText.text,
            "actions": [
                {
                  "type": "postback",
                  "label": messageText.label.approve,
                  "text":  messageText.text +
                           messageText.status.approved,
                  "data": "processInstanceId="+body.process_id+"&q_replymessage=yes"
                },
                {
                  "type": "postback",
                  "label": messageText.label.decline,
                  "text":  messageText.text +
                           messageText.status.declined,
                  "data": "processInstanceId="+body.process_id+"&q_replymessage=no"
                }
            ]
        }    
      };
      var retrievedRequestData = retrieveRequest(body.process_id)
      .then(function(res){
        console.log("retrievedRequestData",res.data);
        return res.data;
      })
      .catch(function(err){

      });
      saveRequest({
        user_name:body.user_name,
        overtime_date:body.overtime_date,
        process_id:body.process_id,
        reason:body.overtime_reason,        
      });
      client.pushMessage(managerData.line_id, message)
      .then(() => { 
          fromNode(querystring, axios,body.process_id, 'yes'); 
        })
      .catch((err) => { 
          fromNode(querystring, axios, body.process_id, 'no');         
        });
}
module.exports = sender