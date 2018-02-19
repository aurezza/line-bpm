var mongoose = require('mongoose');
// schema
var apiSchema = mongoose.Schema({
	api_name: String,
	key: String,
	token: {
        type: String
        // TODO: add property unique
	},
	created_at: Date,
	updated_at: Date
});	

// user model
var apiModel = mongoose.model('api', apiSchema);  

module.exports = apiModel;   
