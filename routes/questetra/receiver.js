'use strict';
var messageText = require('../questetra/messageText/messageBodyText');
var labelText = require('../questetra/messageText/labelBody');
var messageStatus = require('../questetra/messageText/messageStatus');
function receiver(router, client){
  router.post('/receiveFromQuest', function(req, res) {
    var messageText = messageBodyText(req.body);
    var labelText = labelText();
    var messageStatus = messageStatus();
    var lineId = 'U34f149724f23c004673a3e11409ed3c0';
    const message = {
      "type": "template",
      "altText": "this is a confirm template",
      "template": {
          "type": "confirm",
          "text":  messageText,
          "actions": [
              {
                "type": "postback",
                "label": labelText.Approve,
                "text":  messageText+
                         messageStatus.Approved,
                "data": "processInstanceId="+req.body.process_id+"&key=NKOmgMAo36gnNvVnQwyKNojRwKh4gte0&q_replymessage=yes"
              },
              {
                "type": "postback",
                "label": labelText.Decline,
                "text":  messageText+
                         messageStatus.Declined,
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