const mongoose = require("mongoose");

const Page = mongoose.model("Page", {
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 200
  },
  data: {
    type: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = { Page };
