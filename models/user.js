/* User model */
'use strict';

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Making a Mongoose model a little differently: a Mongoose Schema
// Allows us to add additional functionality.
const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true
	}, 
	password: {
		type: String,
		required: true,
		minlength: 6
	},
  covers: {
    type: [mongoose.Schema.Types.ObjectId]
  }
})

// An example of Mongoose middleware.
// This function will run immediately prior to saving the document
// in the database.
UserSchema.pre('save', async function() {
	const user = this; // binds this to User document instance

	// checks to ensure we don't hash password more than once
	if (user.isModified('password')) {
		// generate salt and hash the password
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);
	}
})

// A static method on the document model.
// Allows us to find a User document by comparing the hashed password
//  to a given one, for example when logging in.
UserSchema.statics.findByUsernamePassword = async function(username, password) {
	const User = this // binds this to the User model

	// First find the user by their username
	const user = await User.findOne({ username: username });
	if (!user) {
		return Promise.reject();
	}
	// if the user exists, make sure their password is correct
	const result = await bcrypt.compare(password, user.password);
	if (!result) {
		return Promise.reject();
	}
	return user;
}

// A static method on the document model.
// Allows us to find a User document
UserSchema.statics.findUser = function(username, password) {
	const User = this // binds this to the User model

	// Find the user by their username
	return User.findOne({ username: username }).then((user) => {
		if (!user) {
			return Promise.reject()  // a rejected promise
		} else {
      return Promise.resolve(user)
    }
	})
}

// make a model using the User schema
const User = mongoose.model('User', UserSchema)
module.exports = { User }

