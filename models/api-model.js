'use strict';
var mongoose = require('mongoose');
// schema
var apiSchema = mongoose.Schema({
    api_name: String,
    api_key: String,
    token: {
	    type: String
	    // TODO: add property unique
    },
    origin: String,
    created_at: String,
    updated_at: String
});	

// user model
var apiModel = mongoose.model('api', apiSchema);  

module.exports = apiModel;   
