'use strict';
var messageContent = require('./message-text/message-content');
var replyToQuestetra = require('../line/reply-to-questetra');
function receiver(router, client, axios, querystring){
  router.post('/receiveFromQuest', function(req, res) {
    var messageText = messageContent(req.body);
    //Change this to the object retrieved from database
    //<-------------------------------------------->
    var managerData = {
        name: "Aurezza Lyn Dunque",
        email : "aldunque@tmj.ph",
        employee_id : "6",
        line_id:"U309ccccafe5e38419bcc10c23b117620"
    };
    //<-------------------------------------------->
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
      
      replyToQuestetra(querystring, axios, 'empty', instanceId, 'yes')
      .then (() => {
        console.log('message sent, isMessageSent : yes')
      })
      
    })
    .catch((err) => {
      replyToQuestetra(querystring, axios, 'empty', instanceId, 'no');
      console.log('message not sent, isMessageSent : no')
    });
    res.send(true);

  });
}
module.exports = receiver;