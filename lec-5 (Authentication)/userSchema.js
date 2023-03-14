const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name1: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  tele: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
