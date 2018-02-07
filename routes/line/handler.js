var scanQrCode = require('./scan-qr-code');
var informUserExistence = require('./user-inform-if-exist');
var toNode = require('./to-node');
var retrieveUserByLineId = require('.././retrieve-user-by-line-id');

function handler(router, axios, querystring, client){
    router.post('/handler', function(req, res) {

        var eventType = req.body.events[0].type;
        console.log("eventType",eventType)
        functionHandler[eventType]({req:req.body,client:client});

        res.send(true)
    });
}

var functionHandler = {};
functionHandler.follow = function(params) {
    
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
functionHandler.postback = function(params){
    console.log("params",params.req.events[0])
    // if(params.req.events[0].postback != null && params.req.events[0].message == null){
    //     //postBack is data query params depending on manager reply
    //     var postBack = params.req.body.events[0].postback;
    //     toNode(postBack);
    // }
}
functionHandler.unfollow = function(params){console.log("unfollow event")};
functionHandler.message = function(params){console.log("message event")};
module.exports = handler;