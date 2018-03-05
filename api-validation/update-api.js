'use strict';
var apiModel = require('../models/api-model');
var logger = require('../logger');

function updateApi(api) {
    var dateNow = new Date();
    apiModel.updateOne({ api_name: api.api_name }, 
        { 
            $set: {
                token: api.token, 
                api_key: api.api_key, 
                updated_at: dateNow.toUTCString()
            }
        },
        function() {
            logger.info("API for " + api.api_name + " was updated");
        });
}

module.exports = updateApi;