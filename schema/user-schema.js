var mongoose = require('mongoose');
// schema
var userSchema = mongoose.Schema({
    employee_id: String,
    employee_name: String,
    employee_email: {
        type: String
    },
    line_id: String,
    locale: String
});

// user model
var userModel = mongoose.model('users', userSchema);  

module.exports = userModel;   
