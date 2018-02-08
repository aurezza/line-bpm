var axios = require('axios');
var querystring = require('querystring');
var messageContent = require('../questetra/message-text/message-content');
var fromNode = require('./from-node');
var saveRequest = require('../save-request');
var retrieveRequest = require('../retrieve-request');
function sender(body, managerData, client){
    console.log("body",body);
    var messageText = messageContent(body);
      var retrievedRequestData = retrieveRequest(body.process_id);

      retrievedRequestData
      .then(function(retrievedRequestData){

        if(retrievedRequestData==null) {
            console.log("retrievedRequestData",retrievedRequestData);
            console.log("empty");
        }else{
            console.log("retrievedRequestData",retrievedRequestData)
            saveRequest({
                user_name:body.user_name,
                overtime_date:body.overtime_date,
                process_id:body.process_id,
                reason:body.overtime_reason, 
                response:'pending',
                manager_email:body.manager_email,       
            });

        }

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
                      "data": "processInstanceId="+body.process_id+"&q_replymessage=yes"+
                      "&manager_email="+body.manager_email+"&user_name="+body.user_name+
                      "&overtime_date="+body.overtime_date+"&overtime_reason="+body.overtime_reason
                    },
                    {
                      "type": "postback",
                      "label": messageText.label.decline,
                      "text":  messageText.text +
                               messageText.status.declined,
                      "data": "processInstanceId="+body.process_id+"&q_replymessage=no"+
                      "&manager_email="+body.manager_email+"&user_name="+body.user_name+
                      "&overtime_date="+body.overtime_date+"&overtime_reason="+body.overtime_reason
                    }
                ]
            }    
          };
          client.pushMessage(managerData.line_id, message)
          .then(() => { 
              fromNode(querystring, axios,body.process_id, 'yes'); 
            })
          .catch((err) => { 
              fromNode(querystring, axios, body.process_id, 'no');         
            });            

      })
      .catch(function(err){

      });



}
module.exports = sender