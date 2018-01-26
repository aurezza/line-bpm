function connection(mongoose){
	// remove deprecationWarning error
	mongoose.connect('mongodb://localhost/testdb', {
		useMongoClient: true
	});
	// get the default connection//localhost
	var db = mongoose.connection;
	// notification error for mongodb errors
	db.on('error', console.error.bind(
	  console,
	  'MongoDB Connection Error'
	));
}

module.exports = connection;
