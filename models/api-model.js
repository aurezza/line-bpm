var mongoose = require('mongoose');
// schema
var apiSchema = mongoose.Schema({
	api_name: String,
	key: String,
	token: {
        type: String
        // add property unique
	},
	created_at: Date,
	updated_at: Date,
	token: String
});	

// user model
var apiModel = mongoose.model('api', apiSchema);  

module.exports = apiModel;   
