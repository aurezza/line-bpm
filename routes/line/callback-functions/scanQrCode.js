function scanQrCode(client,line_userId)
{
    console.log("fire");
    console.log("client",client);
    console.log("line_userId",line_userId);
    // const message = {
    //     type: 'text',
    //     text: 'Hello! \n Thanks for adding BPMS-Messaging Bot \n To proceed please login to https://bpms-messaging.com/'+req.body.events[0].source.userId,
    //     };
        
    // client.pushMessage(line_userId, message)
    //     .then(() => {
    //         console.log("message sent to "+ line_userId);    
    //     })
    //     .catch((err) => {
    //         console.log(err)
    //     });         
          
}

module.exports = scanQrCode;