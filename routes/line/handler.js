var scanQrCode = require('./scanQrCode');
function handler(router, axios, querystring, client){
    router.post('/handler', function(req, res) {
       
        var eventType = req.body.events[0].type;
        var line_userId = req.body.events[0].source.userId;

        if(eventType == "follow") scanQrCode(client,line_userId);
        res.send(true)    	
    });
}

module.exports = handler;