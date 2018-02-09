var translations = require("../locale/locale-checker")
function sendResponded(retrievedRequestData,client,line_userId){
    
    var response = translations('jp','responded-message');

    var messageType = {
        Approved:"responded",
        Decline:"responded",
        cancelled:"cancelled"
    }
    console.log("retrievedRequestData",retrievedRequestData.status);
    //var messageResponse = response()



    const message = {
        type: 'text',
        text: response,
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