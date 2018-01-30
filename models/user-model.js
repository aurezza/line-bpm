var mongoose = require('mongoose');
// schema
var userSchema = mongoose.Schema({
	employeeID: Number,
	employeeName: String,
	employeeEmail: {
		type: String
	},
	lineID: String,
	locale: String
});

// user model
var userModel = mongoose.model('users', userSchema);  

module.exports = userModel;   
