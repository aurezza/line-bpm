function sendResponded(client,line_userId){
    const message = {
        type: 'text',
        text: "you have already responded to this request",
        };
    client.pushMessage(line_userId, message)
        .then(() => {
            console.log("message sent to "+ line_userId);    
        })
        .catch((err) => {
            console.log(err)
        });
}
module.exports = sendResponded;