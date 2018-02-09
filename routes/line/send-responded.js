var translations = require("../locale/locale-checker")
function sendResponded(client,line_userId){
    var response = translations('jp','responded-message');
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