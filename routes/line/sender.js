function sender(body, messageText){
    var content = {};
    return content = {
        body:body,
        messageText:messageText
    };
}
module.exports = sender