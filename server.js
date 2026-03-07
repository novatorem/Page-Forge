"use strict";
require("dotenv").config();

const express = require("express");
const app = express();

const { mongoose } = require("./db/mongoose");

const { User } = require("./models/user");
const { Cover } = require("./models/cover");

app.use(express.json());

const session = require("express-session");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "change-this-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    }
  })
);

const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

app.post("/users/login", (req, res) => {
  const username = req.body.username.toLowerCase();
  const password = req.body.password;

  User.findByUsernamePassword(username, password)
    .then(user => {
      req.session.user = user._id;
      req.session.username = user.username;
      res.send({ currentUser: user.username, userID: user._id });
    })
    .catch(error => {
      console.log('Login error:', error);
      res.status(400).send({ error: 'Invalid username or password' });
    });
});

app.get("/users/logout", (req, res) => {
  req.session.destroy(error => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send();
    }
  });
});

app.get("/users/check-session", (req, res) => {
  if (req.session.user) {
    res.send({ currentUser: req.session.username, userID: req.session.user });
  } else {
    res.status(401).send();
  }
});

app.post("/users/register", (req, res) => {
  const user = new User({
    username: req.body.username.toLowerCase(),
    password: req.body.password
  });

  user.save().then(
    user => {
      res.send(user);
    },
    error => {
      console.log('Registration error:', error);
      if (error.code === 11000) {
        res.status(400).send({ error: 'Username already exists' });
      } else {
        res.status(400).send({ error: error.message || 'Registration failed' });
      }
    }
  );
});

app.post("/covers/new", requireAuth, (req, res) => {
  const coverID = new mongoose.Types.ObjectId().toHexString();

  const cover = new Cover({
    _id: coverID,
    title: req.body.title,
    data: req.body.data,
    owner: req.body.owner
  });

  cover.save().then(
    result => {
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
      console.log(error);
      res.status(500).send(error);
    }
  );
});

app.get("/covers/:id", requireAuth, (req, res) => {
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
      console.log(error);
      res.status(500).send(error);
    });
});

app.patch("/covers/:cid", requireAuth, (req, res) => {
  const cid = req.params.cid;
  const { data } = req.body;

  if (!mongoose.Types.ObjectId.isValid(cid)) {
    res.status(404).send();
  }

  Cover.findByIdAndUpdate(cid, { $set: { data } }, { new: true })
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

app.delete("/covers/:cid", requireAuth, (req, res) => {
  const cid = req.params.cid;

  if (!mongoose.Types.ObjectId.isValid(cid)) {
    res.status(404).send();
  }

  Cover.findByIdAndDelete(cid)
    .then(cover => {
      if (!cover) {
        res.status(404).send();
      } else {
        res.send(cover);
      }
    })
    .catch(error => {
      res.status(500).send();
    });
});

app.use(express.static(__dirname + "/client/build"));

app.get("/*splat", (req, res) => {
  res.sendFile(__dirname + "/client/build/index.html");
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
