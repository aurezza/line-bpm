var mongoose = require('mongoose');

var requestSchema = mongoose.Schema({
	user_name:String,
	overtime_date:String,
	process_id: Number,
	reason:String
});

// request model
var requestModel = mongoose.model('requests', requestSchema);  

module.exports = requestModel;   