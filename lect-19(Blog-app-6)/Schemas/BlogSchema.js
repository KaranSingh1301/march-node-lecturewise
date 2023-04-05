const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogsSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  textBody: {
    type: String,
    required: true,
  },
  creationDateTime: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    require: true,
    default: false,
  },
  deletionDateTime: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("blogs", blogsSchema);
