var scanQrCode = require('./scan-qr-code');
var replyToQuestetra = require('./repy-to-questetra');
function handler(router, axios, querystring, client){
    router.post('/handler', function(req, res) {
       
        var eventType = req.body.events[0].type;
        var line_userId = req.body.events[0].source.userId;

        if(eventType == "follow") scanQrCode(client,line_userId);
        res.send(true)

        if(req.body.events[0].postback != null && req.body.events[0].message == null){
            replyToQuestetra(querystring, axios);
        }
    });
}

module.exports = handler;