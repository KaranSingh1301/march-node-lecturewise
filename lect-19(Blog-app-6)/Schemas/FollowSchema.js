const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followSchema = new Schema({
  followerUserId: {
    //fk to user collection
    type: Schema.Types.ObjectId,
    ref: "users",
    require: true,
  },
  followingUserId: {
    //fk to user collection
    type: Schema.Types.ObjectId,
    ref: "users",
    require: true,
  },
  creationDateTime: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("follow", followSchema);
