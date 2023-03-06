const mongoose = require("mongoose")
const { DateTime } = require("luxon")

const Schema = mongoose.Schema

const PostSchema = new Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  date: {type: Date, default: Date.now},
  author: {
    authorId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
  },
  numLikes: {type: String, default: "0"},
  numComments: {type: String, default: "0"},
  isPublished: {type: Boolean, required: true}
})

PostSchema.virtual("date_formatted").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

// There will be an url virtual as well. 

module.exports = mongoose.model("Post", PostSchema)