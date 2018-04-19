'use strict';

var Routes = require('../service/Routes');

Routes.post('/receiverCancelledRequest', 'questetra@receiverCancelledRequest');
Routes.post('/receiveFromQuest', 'questetra@recieveFromQuest');

Routes.post('/handler', 'line@eventTrigger');

module.exports = Routes.router;