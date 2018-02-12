var logger = require('../../logger');
function replyToQuestetra(querystring, axios, postBack, axiosParameters) {
    var throttleCounter = 0;
    //1000 = 1sec
    var replyDelayTime = 6000;

    (function resendReplyToQuestetra(){
        setTimeout(postReplyToQuestetra,replyDelayTime,resendReplyToQuestetra);
    })();

    function postReplyToQuestetra(resendReplyToQuestetra){
        axios.post(axiosParameters.url,querystring.stringify(axiosParameters.content))
        .then(function(response){ 
            logger.info('success replying to questetra');            
        })            
        .catch(function(error){
            if(throttleCounter >= 10) return;
            throttleCounter++;
            resendReplyToQuestetra();
        }); 
    }
}
module.exports = replyToQuestetra;