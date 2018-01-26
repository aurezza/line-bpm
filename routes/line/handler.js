var scanQrCode = require('./scan-qr-code');
var replyToQuestetra = require('./reply-to-questetra');
function handler(router, axios, querystring, client){
    router.post('/handler', function(req, res) {
       
        var eventType = req.body.events[0].type;
        var line_userId = req.body.events[0].source.userId;

        if(eventType == "follow") scanQrCode(client,line_userId);
        if(req.body.events[0].postback != null && req.body.events[0].message == null){
            var postBack = req.body.events[0].postback;
            var message = req.body.events[0].message ;
            replyToQuestetra(querystring, axios, postBack, message);
        }
        res.send(true)
    });
}

module.exports = handler;