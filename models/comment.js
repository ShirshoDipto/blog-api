const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: { type: String, required: true },
  author: {
    authorId: { type: Schema.Types.ObjectId, ref: "User", requied: true },
    firstName: { type: String, required: true },
    lastName: { type: String, requied: true },
  },
  date: { type: Date, default: Date.now },
  postId: { type: Schema.Types.ObjectId, requied: true, ref: "Post" },
  numReplies: { type: Number, default: 0 },
  numLikes: { type: Number, default: 0 },
});

CommentSchema.virtual("date_formatted").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

// There will be an url virtual as well.

module.exports = mongoose.model("Comment", CommentSchema);
