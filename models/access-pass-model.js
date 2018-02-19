'use strict';
var mongoose = require('mongoose');

var accessPassSchema = mongoose.Schema({
	access_pass_token:String,
	owner:String,
	status:String,
});

// accessPass model
var accessPassModel = mongoose.model('access_pass', accessPassSchema);  

module.exports = accessPassModel;   