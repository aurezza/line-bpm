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
	created_at: String,
	updated_at: Date // backlog
});	

// user model
var apiModel = mongoose.model('api', apiSchema);  

module.exports = apiModel;   
