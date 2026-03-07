const mongoose = require('mongoose')

const mongoURI = process.env.MONGODB_URI

if (!mongoURI) {
	console.log('ERROR: MONGODB_URI environment variable is not set');
} else {
	mongoose.connect(mongoURI).then(() => {
		console.log('Connected to MongoDB...');
	}).catch(err => {
		console.log('ERROR:', err.message);
	});
}

module.exports = { mongoose }
