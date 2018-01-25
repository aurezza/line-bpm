var scanQrCode = require('./callback-functions/scanQrCode');
function callback(router, axios, querystring, client){
    router.post('/callback', function(req, res) {

        var eventType = req.body.events[0].type
        var line_userId = req.body.events[0].source.userId

        if(eventType == "follow") scanQrCode(client,line_userId);

    	if(req.body.events[0].postback != null && req.body.events[0].message == null){
            var parsedData = querystring.parse(req.body.events[0].postback.data);
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
        res.send(true)    	
    });
}

module.exports = callback;