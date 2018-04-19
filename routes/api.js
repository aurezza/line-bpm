'use strict';

var express = require('express');
var router = express.Router();
var Routes = require('../service/Routes');

// var LineController = require('../controller/LineController');
// var QuestetraController = require('../controller/QuestetraController');

// external page
var routeService = Routes(router);

// router.post('/receiverCancelledRequest', QuestetraController().receiverCancelledRequest);
// router.post('/receiveFromQuest', QuestetraController().recieveFromQuest);

// router.post('/handler', LineController().eventTrigger);

routeService.post('/receiverCancelledRequest', 'questetra@receiverCancelledRequest');
routeService.post('/receiveFromQuest', 'questetra@recieveFromQuest');

routeService.post('/handler', 'line@eventTrigger');

module.exports = router;