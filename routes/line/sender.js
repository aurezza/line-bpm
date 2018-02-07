var axios = require('axios');
var querystring = require('querystring');
var messageContent = require('../questetra/message-text/message-content');
var fromNode = require('./from-node');

function sender(body, managerData, client){
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
      
      client.pushMessage(managerData.line_id, message)
      .then(() => { 
          fromNode(querystring, axios,body.process_id, 'yes'); 
        })
      .catch((err) => { 
          fromNode(querystring, axios, body.process_id, 'no');         
        });
}
module.exports = sender