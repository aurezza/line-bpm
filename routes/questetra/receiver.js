'use strict';

var checkManagerDetails = require('../line/checker-of-manager-details');
function receiver(router, client){
    router.post('/receiveFromQuest', function(req, res) {
        //Change this to the object retrieved from database
        var managerData = {
            name: "Aurezza Lyn Dunque",
            email : "aldunque@tmj.ph",
            employee_id : "6",
            line_id:"U309ccccafe5e38419bcc10c23b117620"
        };
        //<-------------------------------------------->
        checkManagerDetails(managerData, req.body, client);    
    });
    res.send(true);    
}
module.exports = receiver;