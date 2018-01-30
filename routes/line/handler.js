var scanQrCode = require('./scan-qr-code');
var fromHandler = require('./from-handler');
function handler(router, axios, querystring, client){
    router.post('/handler', function(req, res) {
        var eventType = req.body.events[0].type;
        var line_userId = req.body.events[0].source.userId;

        if(eventType == "follow") scanQrCode(client,line_userId);
        if(eventType == "postback"){
            if(req.body.events[0].postback != null && req.body.events[0].message == null){
                //postBack is data query params depending on manager reply
                var postBack = req.body.events[0].postback;
                fromHandler(querystring, axios, postBack);
            }
        }

        res.send(true)
    });
}

module.exports = handler;