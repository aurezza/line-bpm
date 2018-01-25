'use strict';
var messageContent = require('./messagetext/messageContent');
function receiver(object){
  object.router.post('/receiveFromQuest', function(req, res) {
    var textContent = messageContent(req.body);
    var lineId = 'U34f149724f23c004673a3e11409ed3c0';
    const message = {
      "type": "template",
      "altText": "this is a confirm template",
      "template": {
          "type": "confirm",
          "text":  textContent.text,
          "actions": [
              {
                "type": "postback",
                "label": textContent.label.approve,
                "text":  textContent.text +
                         textContent.status.approved,
                "data": "processInstanceId="+req.body.process_id+"&key=NKOmgMAo36gnNvVnQwyKNojRwKh4gte0&q_replymessage=yes"
              },
              {
                "type": "postback",
                "label": textContent.label.decline,
                "text":  textContent.text +
                         textContent.status.declined,
                "data": "processInstanceId="+req.body.process_id+"&key=NKOmgMAo36gnNvVnQwyKNojRwKh4gte0&q_replymessage=no"
                
              }
          ]
      }
    
    }
    object.client.pushMessage(lineId, message)
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