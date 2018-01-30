var replyToQuestetra = require('./reply-to-questetra');
function fromHandler(querystring, axios, postBack){
    var parsedData = (querystring.parse(postBack.data));
    var axiosParameters = {
        url: process.env.REPLYURL_TO_QUESTETRA,
        content : {
            processInstanceId:parsedData.processInstanceId,
            key:process.env.KEY_TO_QUESTETRA,
            //q_replymessage from questetra also be used as query params
            q_replymessage:parsedData.q_replymessage
        }
    };
    replyToQuestetra(querystring, axios, postBack, axiosParameters)
}

module.exports = fromHandler;