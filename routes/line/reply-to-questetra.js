function replyToQuestetra(querystring, axios, postBack, message) {
    var parsedData = querystring.parse(postBack.data);
    var repeatCounter = 0;
    (function resend(){
        setTimeout(callAxios,6000,resend);
    })();

    function callAxios(resend){
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
                    if(repeatCounter >= 10) return;
                    repeatCounter++;
                    console.log(repeatCounter);
                    resend();
            }); 
    }
}
module.exports = replyToQuestetra;