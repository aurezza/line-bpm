var scanQrCode = require('./scan-qr-code');
var informUserExistence = require('./user-inform-if-exist');
var toNode = require('./to-node');
var retrieveUserByLineId = require('.././retrieve-user-by-line-id');

function handler(router, axios, querystring, client){
    router.post('/handler', function(req, res) {
        var eventType = req.body.events[0].type;
        
        eventHandler[eventType]({req:req.body,client:client});

        res.send(true)
    });
}

var eventHandler = {};
eventHandler.follow = function(params) {
    
    var line_userId = params.req.events[0].source.userId;
    var users = retrieveUserByLineId(line_userId);
    users
    .then(function (users){
        if(users) return  informUserExistence(params.client,line_userId,users.employee_name);
        scanQrCode(params.client,line_userId);
    })
    .catch(function (){
        console.log(error)
    });
}
eventHandler.postback = function(params){
        //postBack is data query params depending on manager reply
        console.log("postback",params)
        var postBack = params.req.events[0].postback;
        toNode(postBack);
}

eventHandler.unfollow = function(params){console.log("unfollow event")};
eventHandler.message = function(params){
    console.log("message",params);
    console.log("message event");
};
module.exports = handler;