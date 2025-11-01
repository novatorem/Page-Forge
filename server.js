"use strict";
const log = console.log;

const express = require("express");
// starting the express server
const app = express();

// mongoose and mongo connection
const { mongoose } = require("./db/mongoose");

// import the mongoose models
const { User } = require("./models/user");
const { Cover } = require("./models/cover");

// to validate object IDs
const { ObjectID } = require("mongodb");

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// express-session for managing user sessions
const session = require("express-session");
app.use(bodyParser.urlencoded({ extended: true }));

/*** User handling **************************************/
// Create a session cookie
app.use(
  session({
    secret: "oursecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: new Date(253402300000000),
      httpOnly: true
    }
  })
);

// A route to login and create a session
app.post("/users/login", (req, res) => {
  const username = req.body.username.toLowerCase();
  const password = req.body.password;

  // Use the static method on the User model to find a user
  // by their username and password
  User.findByUsernamePassword(username, password)
    .then(user => {
      // Add the user's id to the session cookie.
      // We can check later if this exists to ensure we are logged in.
      req.session.user = user._id;
      req.session.username = user.username;
      res.send({ currentUser: user.username, userID: user._id });
    })
    .catch(error => {
      log('Login error:', error);
      res.status(400).send({ error: 'Invalid username or password' });
    });
});

// A route to logout a user
app.get("/users/logout", (req, res) => {
  // Remove the session
  req.session.destroy(error => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send();
    }
  });
});

// A route to check if a use is logged in on the session cookie
app.get("/users/check-session", (req, res) => {
  if (req.session.user) {
    res.send({ currentUser: req.session.username, userID: req.session.user });
  } else {
    res.status(401).send();
  }
});

// Set up a POST route to *create* a user
app.post("/users/register", (req, res) => {
  // Create a new user
  const user = new User({
    username: req.body.username.toLowerCase(),
    password: req.body.password
  });

  // Save the user
  user.save().then(
    user => {
      res.send(user);
    },
    error => {
      log('Registration error:', error);
      if (error.code === 11000) {
        res.status(400).send({ error: 'Username already exists' });
      } else {
        res.status(400).send({ error: error.message || 'Registration failed' });
      }
    }
  );
});

/*********************************************************/

/*** API Routes below ************************************/

/** Page resource routes **/
// a POST request to create a user's page
app.post("/covers/new", (req, res) => {
  log(req.body);
  const coverID = new mongoose.Types.ObjectId().toHexString();

  const cover = new Cover({
    _id: coverID,
    title: req.body.title,
    data: req.body.data,
    owner: req.body.owner
  });

  cover.save().then(
    result => {
      // Append to list of covers
      const userID = req.body.owner;
      User.findOneAndUpdate(
        { _id: userID },
        { $push: { covers: coverID } },
        { upsert: true }
      ).then(
        result => {
          res.status(200).send(req.body.title + " created!");
        },
        error => {
          res.status(500).send(error);
        }
      );
    },
    error => {
      log(error);
      res.status(500).send(error);
    }
  );
});

// a GET route to get covers based on user
app.get("/covers/:id", (req, res) => {
  const id = req.params.id;

  Cover.find({ owner: id })
    .then(results => {
      if (!results) {
        res.status(404).send("Failed to get covers");
      } else {
        res.send(results);
      }
    })
    .catch(error => {
      log(error);
      res.status(500).send(error);
    });
});

// a PATCH route to save cover to a user
app.patch("/covers/:cid", (req, res) => {
  const cid = req.params.cid;

  // get the updated name and year only from the request body.
  const { data } = req.body;
  const body = { data };

  if (!ObjectID.isValid(cid)) {
    res.status(404).send();
  }

  // Update the cover by their id.
  Cover.findByIdAndUpdate(cid, { $set: body }, { new: true })
    .then(cover => {
      if (!cover) {
        res.status(404).send();
      } else {
        res.send(cover);
      }
    })
    .catch(error => {
      res.status(400).send();
    });
});


// a DELETE route to delete cover to a user
app.delete("/covers/:cid", (req, res) => {
  const cid = req.params.cid;

  // get the updated name and year only from the request body.
  const { data } = req.body;
  const body = { data };

  if (!ObjectID.isValid(cid)) {
    res.status(404).send();
  }
  
  Cover.findByIdAndRemove(cid)
    .then(cover => {
      if (!cover) {
        res.status(404).send();
      } else {
        res.send(cover);
      }
    })
    .catch(error => {
      res.status(500).send(); // server error, could not delete.
    });
});


/*** Webpage routes below **********************************/
// Serve the build
app.use(express.static(__dirname + "/client/build"));

// All routes other than above will go to index.html
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/client/build/index.html");
});

/*************************************************/
// Express server listening...
const port = process.env.PORT || 3001;
app.listen(port, () => {
  log(`Listening on port ${port}...`);
});
