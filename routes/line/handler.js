'use strict';
var logger = require('../../logger');

var LineController = require('../../controller/line');

function handler(router, client) {
    router.post('/handler', Controller);

    function Controller(req, res) {
        logger.info('line handler triggered');
        var lineController = new LineController();
        var eventType = req.body.events[0].type;
        lineController.eventHandler[eventType]({
            req: req.body, 
            client: client
        })
        res.send(true);
    }
}


module.exports = handler;