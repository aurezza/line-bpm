var scanQrCode = require('./line-receiver-functions/scanQrCode');
function lineReceiver(router, axios, querystring, client){
    router.post('/lineReceiver', function(req, res) {
       
        var eventType = req.body.events[0].type;
        var line_userId = req.body.events[0].source.userId;

        if(eventType == "follow") scanQrCode(client,line_userId);
        res.send(true)    	
    });
}

module.exports = lineReceiver;