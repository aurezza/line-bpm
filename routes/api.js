'use strict';

var express = require('express');
var router = express.Router();

var LineController = require('../controller/LineController');
var QuestetraController = require('../controller/QuestetraController');

router.post('/receiverCancelledRequest', QuestetraController().receiverCancelledRequest); //ext
router.post('/receiveFromQuest', QuestetraController().recieveFromQuest); // ext

router.post('/handler', LineController().eventTrigger); // ext


module.exports = router;