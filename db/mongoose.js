/* This module will hold our connection to 
   our mongo server through the Mongoose API.
   We will access the connection in our express server. */
const mongoose = require('mongoose')

/* Connnect to our database */
// Get the URI of the local database, or the one specified on deployment.
const mongoURI = process.env.MONGODB_URI

if (!mongoURI) {
	console.log('ERROR: MONGODB_URI environment variable is not set');
} else {
	mongoose.connect(
		mongoURI, { useNewUrlParser: true, useUnifiedTopology: true
	}).then(() => {
		console.log('Connected to MongoDB...');
	}).catch(err => {
		console.log('ERROR:', err.message);
	});
}

module.exports = { mongoose }  // Export the active connection.