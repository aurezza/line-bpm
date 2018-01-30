function replyToQuestetra(querystring, axios, postBack) {
    var parsedData = querystring.parse(postBack.data);

    var qstringContent = {
        successSendingofMessageToLineOfManager:{
            processInstanceId:req.body.process_id,
            key:process.env.KEY_TO_QUESTETRA_REQUEST_STATUS,
            q_sendingstatus:'yes'
        },
        failedSendingOfMessageToLineOfManager:{
            processInstanceId:req.body.process_id,
            key:process.env.KEY_TO_QUESTETRA_REQUEST_STATUS,
            q_sendingstatus:'no'        
        },
        replyOfManager:{
            processInstanceId:parsedData.processInstanceId,
            key:process.env.KEY_TO_QUESTETRA,
            //q_replymessage from questetra also be used as query params
            q_replymessage:parsedData.q_replymessage
        }
    }
    var replyURL = {
        replyOfManager = process.env.REPLYURL_TO_QUESTETRA,
        statusOfSendingToLineOfManager = process.env.REPLYURL_TO_QUESTETRA_REQUEST_STATUS
    }
    
    if (postBack == false) { 
        qstringContent = qstringContent.successSendingofMessageToLineOfManager; 
        replyURL = replyURL.statusOfSendingToLineOfManager;
    } else {
        qstringContent = qstringContent.replyOfManager; 
        replyURL = replyURL.replyOfManager;        
    }

    var throttleCounter = 0;
    var replyDelayTime = 6000;

    (function resendReplyToQuestetra(){
        setTimeout(postReplyToQuestetra,replyDelayTime,resendReplyToQuestetra);
    })();

    function postReplyToQuestetra(resendReplyToQuestetra){
        axios.post(replyURL,
            querystring.stringify(qstringContent))
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