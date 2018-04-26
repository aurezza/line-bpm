'use strict';

var Routes = require('../service/Routes');

Routes.post('/receiverCancelledRequest', 'QuestetraController@receiverCancelledRequest');
Routes.post('/receiveFromQuest', 'QuestetraController@recieveFromQuest');

Routes.post('/handler', 'LineController@eventTrigger');

module.exports = Routes.router;