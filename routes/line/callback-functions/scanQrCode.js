function scanQrCode(object)
{
    if(object.eventType == "follow"){
        const message = {
            type: 'text',
            text: 'Hello! \n Thanks for adding BPMS-Messaging Bot \n To proceed please login to https://bpms-messaging.com/'+req.body.events[0].source.userId,
          };
          
        object.client.pushMessage(object.line_userId, message)
            .then(() => {
                console.log("message sent to "+ object.line_userId);    
            })
            .catch((err) => {
                console.log(err)
            });
    return var sampleText = {
        eventType: object.eventType,
        client : object.client
        };         
    }      
}

module.exports = scanQrCode;