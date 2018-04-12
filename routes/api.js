'use strict';

var express = require('express');
var router = express.Router();

var LineController = require('../controller/LineController');
var QuestetraController = require('../controller/QuestetraController');

router.post('/receiverCancelledRequest', QuestetraController().receiverCancelledRequest);
router.post('/receiveFromQuest', QuestetraController().recieveFromQuest);

router.post('/handler', LineController().eventTrigger);


module.exports = router;