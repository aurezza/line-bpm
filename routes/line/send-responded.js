var translations = require("../locale/locale-checker")
function sendResponded(retrievedRequestData,client,line_userId){
    
    var response = translations('jp','responded-message');
    console.log("retrievedRequestData.status",retrievedRequestData.status);
    var messageType = {
        Approved:"responded",
        Declined:"responded",
        cancelled:"cancelled"
    }
    var messageResponse = response(messageType[retrievedRequestData.status])



    const message = {
        type: 'text',
        text: messageResponse,
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