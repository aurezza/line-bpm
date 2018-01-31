'use strict';
var messageContent = require('./message-text/message-content');
var sender = require('../line/sender');
var fromNode = require('../line/from-node');
var checkManagerDetails = require('../line/checker-of-manager-details');
function receiver(router, client, axios, querystring){
  router.post('/receiveFromQuest', function(req, res) {
    
    console.log("sender",test);
    var messageText = messageContent(req.body);
    var test = sender(req.body, messageText);
    //Change this to the object retrieved from database
    //<-------------------------------------------->
    var managerData = {
        name: "Aurezza Lyn Dunque",
        email : "aldunque@tmj.ph",
        employee_id : "6",
        line_id:"U309ccccafe5e38419bcc10c23b117620"
    };
    //<-------------------------------------------->
    if(checkManagerDetails(managerData, req.body.process_id))
    {
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
                      "data": "processInstanceId="+req.body.process_id+"&q_replymessage=yes"
                    },
                    {
                      "type": "postback",
                      "label": messageText.label.decline,
                      "text":  messageText.text +
                               messageText.status.declined,
                      "data": "processInstanceId="+req.body.process_id+"&q_replymessage=no"
                    }
                ]
            }    
          };
          
          client.pushMessage(managerData.line_id, message)
          .then(() => { 
              fromNode(querystring, axios, req.body.process_id, 'yes'); 
          })
          .catch((err) => { 
              fromNode(querystring, axios, req.body.process_id, 'no');         
          });
          res.send(true);
    }
  });
}
module.exports = receiver;