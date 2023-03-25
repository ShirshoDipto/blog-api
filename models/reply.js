const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  author: {
    authorId: { type: Schema.Types.ObjectId, ref: "User", requied: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  content: { type: String, required: true },
  commentId: { type: Schema.Types.ObjectId, ref: "Comment", required: true },
  date: { type: Date, default: Date.now },
});

ReplySchema.virtual("date_formatted").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Reply", ReplySchema);
