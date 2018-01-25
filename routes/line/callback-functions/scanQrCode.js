function scanQrCode(eventType,client,line_userId)
{
    console.log("scan qr code is fired");
    if(eventType == "follow"){
        const message = {
            type: 'text',
            text: 'Hello! \n Thanks for adding BPMS-Messaging Bot \n To proceed please login to https://bpms-messaging.com/'+req.body.events[0].source.userId,
          };
          
        client.pushMessage(line_userId, message)
            .then(() => {
                console.losg("message sent to "+ line_userId);    
            })
            .catch((err) => {
                console.log(err)
            });         
    }      
}

module.exports = scanQrCode;