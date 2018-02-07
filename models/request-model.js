var mongoose = require('mongoose');

var requestSchema = mongoose.Schema({
	process_id: String,
});

// request model
var requestModel = mongoose.model('request', requestSchema);  

module.exports = requestModel;   