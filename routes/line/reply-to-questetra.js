function replyToQuestetra(querystring, axios, postBack, instanceId, isMessageSent) {
    console.log('fire reply');
    var parsedData = {};
    var queryStringContent = {};
    var url;
    console.log('postBack',postBack);
    if(postBack != 'empty' ) parsedData = (querystring.parse(postBack.data));

    var replyUrl = {
        replyOfManager: process.env.REPLYURL_TO_QUESTETRA,
        statusOfRequest: process.env.REPLYURL_TO_QUESTETRA_REQUEST_STATUS
    };

    var qstringContent = {
        statusOfRequest:{
            processInstanceId:instanceId,
            key:process.env.KEY_TO_QUESTETRA_REQUEST_STATUS,
            //q_sendingstatus from questetra also be used as query params
            q_sendingstatus:isMessageSent
        },
        replyOfManager : {
            processInstanceId:parsedData.processInstanceId,
            key:process.env.KEY_TO_QUESTETRA,
            //q_replymessage from questetra also be used as query params
            q_replymessage:parsedData.q_replymessage
        }
    };

    if (postBack != 'empty'){
        queryStringContent = qstringContent.replyOfManager;
        url = replyUrl.replyOfManager;
    } else {
        queryStringContent = qstringContent.statusOfRequest;
        url = replyUrl.statusOfRequest;
    } 


    var throttleCounter = 0;
    //1000 = 1sec
    var replyDelayTime = 6000;

    (function resendReplyToQuestetra(){
        setTimeout(postReplyToQuestetra,replyDelayTime,resendReplyToQuestetra);
    })();

    function postReplyToQuestetra(resendReplyToQuestetra){
        console.log('fire axios');
        axios.post(url,
            querystring.stringify(queryStringContent))
            .then(function(response){
                    console.log('success');                
            })            
            .catch(function(error){
                    // console error here
                    console.log('failed');
                    if(throttleCounter >= 10) return;
                    throttleCounter++;
                    resendReplyToQuestetra();
            }); 
    }
}
module.exports = replyToQuestetra;