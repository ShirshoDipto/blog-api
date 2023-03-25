const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const LikeSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
  referenceId: { type: String, required: true },
});

LikeSchema.virtual("date_formatted").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Like", LikeSchema);
