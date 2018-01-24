'use strict';
var localechecker = require('../locale/localechecker');
function receiver(router, client){
  router.post('/receiveFromQuest', function(req, res) {
    console.log("req.body",req.body);
    var localeText = localechecker();
    console.log(localeText);
    var lineId = 'U34f149724f23c004673a3e11409ed3c0';
    const message = {
      "type": "template",
      "altText": "this is a confirm template",
      "template": {
          "type": "confirm",
          "text":  localeText.text.Name +" : " + req.body.user_name + "\n"+
                   localeText.text.OvertimeDate +" : " + req.body.overtime_date + "\n"+
                   localeText.text.OvertimeTime +" : " + req.body.overtime_time + "\n"+
                   localeText.text.OverTimeReason +" : " + req.body.overtime_reason,
          "actions": [
              {
                "type": "postback",
                "label": localeText.label.Approve,
                "text":  localeText.text.Name +" : " + req.body.user_name + "\n"+
                         localeText.text.OvertimeDate +" : " + req.body.overtime_date + "\n"+
                         localeText.text.OvertimeTime +" : " + req.body.overtime_time + "\n"+
                         localeText.text.OverTimeReason +" : " + req.body.overtime_reason + "\n"+
                         localeText.text.Status +" : " +localeText.text.Approved,
                "data": "processInstanceId="+req.body.process_id+"&key=NKOmgMAo36gnNvVnQwyKNojRwKh4gte0&q_replymessage=yes"
              },
              {
                "type": "postback",
                "label": localeText.label.Decline,
                "text":  localeText.text.Name +" : " + req.body.user_name + "\n"+
                         localeText.text.OvertimeDate +" : " + req.body.overtime_date + "\n"+
                         localeText.text.OvertimeTime +" : " + req.body.overtime_time + "\n"+
                         localeText.text.OverTimeReason +" : " + req.body.overtime_reason + "\n"+
                         localeText.text.Status +" : " +localeText.text.Declined,
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