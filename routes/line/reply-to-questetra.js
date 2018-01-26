function replyToQuestetra(querystring, axios, postBack, message) {
    var parsedData = querystring.parse(postBack.data);
    var throttleCounter = 0;

    (function resendReplyToQuestetra(){
        setTimeout(postReplyToQuestetra,6000,resendReplyToQuestetra);
    })();

    function postReplyToQuestetra(resendReplyToQuestetra){
        axios.post(process.env.REPLYURL_TO_QUESTETRA,
            querystring.stringify({
                processInstanceId:parsedData.processInstanceId,
                key:process.env.KEY_TO_QUESTETRA,
                q_replymessage:parsedData.q_replymessage
            }))
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