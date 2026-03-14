"use strict";
require("dotenv").config();

const express = require("express");
const app = express();
const rateLimit = require("express-rate-limit");

const { mongoose } = require("./db/mongoose");

const { User } = require("./models/user");
const { Page } = require("./models/page");

app.use(express.json());

const session = require("express-session");
app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "change-this-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 90 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    }
  })
);

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(generalLimiter);

const MAX_PAGE_DATA_BYTES = 100 * 1024;
const MAX_TITLE_LENGTH = 200;

const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

const handleSaveError = (error, res) => {
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors).map(e => e.message).join(" ");
    return res.status(400).send({ error: message });
  }
  console.log(error);
  res.status(500).send({ error: "An unexpected error occurred." });
};

app.post("/users/login", authLimiter, (req, res) => {
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

app.post("/users/register", authLimiter, (req, res) => {
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

app.post("/pages/new", requireAuth, (req, res) => {
  const { title, data, owner } = req.body;

  if (!title || title.length > MAX_TITLE_LENGTH) {
    return res.status(400).send({ error: `Title must be between 1 and ${MAX_TITLE_LENGTH} characters.` });
  }
  if (data && Buffer.byteLength(data, "utf8") > MAX_PAGE_DATA_BYTES) {
    return res.status(400).send({ error: "Page content exceeds the 100 KB limit." });
  }

  const pageID = new mongoose.Types.ObjectId().toHexString();

  const page = new Page({ _id: pageID, title, data, owner });

  page.save().then(
    () => {
      User.findOneAndUpdate(
        { _id: owner },
        { $push: { pages: pageID } },
        { upsert: true }
      ).then(
        () => res.status(200).send(title + " created!"),
        error => res.status(500).send({ error: "Failed to link page to user." })
      );
    },
    error => handleSaveError(error, res)
  );
});

app.get("/pages/:id", requireAuth, (req, res) => {
  const id = req.params.id;

  Page.find({ owner: id })
    .then(results => {
      if (!results) {
        res.status(404).send("Failed to get pages");
      } else {
        res.send(results);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).send(error);
    });
});

app.patch("/pages/:pid", requireAuth, (req, res) => {
  const pid = req.params.pid;
  const { data, title } = req.body;

  if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(404).send();
  }
  if (title !== undefined && title.length > MAX_TITLE_LENGTH) {
    return res.status(400).send({ error: `Title must be ${MAX_TITLE_LENGTH} characters or fewer.` });
  }
  if (data !== undefined && Buffer.byteLength(data, "utf8") > MAX_PAGE_DATA_BYTES) {
    return res.status(400).send({ error: "Page content exceeds the 100 KB limit." });
  }

  const update = {};
  if (data !== undefined) update.data = data;
  if (title !== undefined) update.title = title;

  Page.findByIdAndUpdate(pid, { $set: update }, { returnDocument: 'after' })
    .then(page => {
      if (!page) {
        res.status(404).send();
      } else {
        res.send(page);
      }
    })
    .catch(error => handleSaveError(error, res));
});

app.delete("/pages/:pid", requireAuth, (req, res) => {
  const pid = req.params.pid;

  if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(404).send();
  }

  Page.findByIdAndDelete(pid)
    .then(page => {
      if (!page) {
        res.status(404).send();
      } else {
        res.send(page);
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
