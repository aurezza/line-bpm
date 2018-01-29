'use strict';
var messageContent = require('./message-text/message-content');
function receiver(object){
  object.router.post('/receiveFromQuest', function(req, res) {
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
    }
    object.client.pushMessage(managerData.line_id, message)
        .then(() => {
          console.log('message sent'); 
        })
        .catch((err) => {
          console.log("error",err);
        });
      res.send(true);

  });
}
module.exports = receiver;