var mongoose = require('mongoose');

var requestSchema = mongoose.Schema({
	user_name:String,
	overtime_date:String,
	process_id: String,
	reason:String,
	response:String,
	manager_email:String
});

// request model
var requestModel = mongoose.model('requests', requestSchema);  

module.exports = requestModel;   