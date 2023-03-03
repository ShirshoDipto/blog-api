const mongoose = require("mongoose")
const { DateTime } = require("luxon")

const Schema = mongoose.Schema

const PostLikeSchema = new Schema({
  author: {type: Schema.Types.ObjectId, ref: "User"},
  date: ({type: Date, default: Date.now})
})

PostLikeSchema.virtual("date_formatted").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("PostLike", PostLikeSchema)