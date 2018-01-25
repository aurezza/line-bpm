'use strict';
var messageContent = require('./messagetext/messageContent');
function receiver(router, client){
  router.post('/receiveFromQuest', function(req, res) {
    var textContent = messageContent(req.body);
    console.log("messageContent",textContent);
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
                "label": textContent.label.Approve,
                "text":  textContent.text+
                         textContent.status.Approved,
                "data": "processInstanceId="+req.body.process_id+"&key=NKOmgMAo36gnNvVnQwyKNojRwKh4gte0&q_replymessage=yes"
              },
              {
                "type": "postback",
                "label": textContent.label.Decline,
                "text":  textContent.text+
                         textContent.status.Declined,
                "data": "processInstanceId="+req.body.process_id+"&key=NKOmgMAo36gnNvVnQwyKNojRwKh4gte0&q_replymessage=no"
                
              }
          ]
      }
    
    }
    client.pushMessage(lineId, message)
        .then(() => {
          // getting the message recieved from questetra and passing to line API 
          console.log('The message: ', req.body.overtime_reason, 'message has ben sent'); 
          // test save data
        })
        .catch((err) => {
          console.log("error",err);
        });
      res.send(true);

  });
}
module.exports = receiver;