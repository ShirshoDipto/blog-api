const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  image: { type: String },
  author: {
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  numComments: { type: Number, default: 0 },
  numLikes: { type: Number, default: 0 },
});

PostSchema.virtual("date_formatted").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

// There will be an url virtual as well.

module.exports = mongoose.model("Post", PostSchema);
