var replyToQuestetra = require('./reply-to-questetra');
function fromHandler(querystring, axios, postBack){
    var parsedData = (querystring.parse(postBack.data));

    var replyUrl = {
        replyOfManager: process.env.REPLYURL_TO_QUESTETRA
    };
    var axiosParameters = {
        replyOfManager : {
            processInstanceId:parsedData.processInstanceId,
            key:process.env.KEY_TO_QUESTETRA,
            //q_replymessage from questetra also be used as query params
            q_replymessage:parsedData.q_replymessage
        }
    };
    replyToQuestetra(querystring, axios, postBack, axiosParameters)
}